import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { fmtClock } from '../lib/format';
import { useBlobUrl } from '../lib/hooks';
import { compressImage, deleteBlob, getMessages, putBlob, saveMessages, type TeacherMessage } from '../storage/media';
import { uid } from '../storage/state';
import { Button } from '../components/ui';

const canRecord = () => typeof window !== 'undefined' && 'MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia;

export function Teacher() {
  const { t } = useT();
  const [messages, setMessages] = useState<TeacherMessage[] | null>(null);
  const [text, setText] = useState('');
  const [image, setImage] = useState<{ key: string; url: string } | null>(null);
  const [recording, setRecording] = useState<{ start: number } | null>(null);
  const [recError, setRecError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const recorderRef = useRef<MediaRecorder | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessages()
      .then(async (list) => {
        if (list.length === 0) {
          const welcome: TeacherMessage = { id: uid(), ts: Date.now(), from: 'teacher', text: t('teacher.welcome'), demoAutoReply: true };
          list = [welcome];
          await saveMessages(list);
        }
        setMessages(list);
      })
      .catch(() => setMessages([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Block body on purpose: newer browsers return a Promise from scrollIntoView, which React rejects as a cleanup.
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages?.length]);

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [recording]);

  const persist = async (next: TeacherMessage[]) => {
    setMessages(next);
    await saveMessages(next);
  };

  const addParentMessage = async (msg: Omit<TeacherMessage, 'id' | 'ts' | 'from'>) => {
    const base = messages ?? [];
    const parentMsg: TeacherMessage = { id: uid(), ts: Date.now(), from: 'parent', ...msg };
    const withParent = [...base, parentMsg];
    await persist(withParent);
    // Scripted demo auto-reply, clearly labelled. No message leaves the device.
    window.setTimeout(() => {
      const reply: TeacherMessage = { id: uid(), ts: Date.now(), from: 'teacher', text: t('teacher.autoReply'), demoAutoReply: true };
      void persist([...withParent, reply]);
    }, 900);
  };

  const send = async () => {
    if (!text.trim() && !image) return;
    await addParentMessage({ text: text.trim() || undefined, imageKey: image?.key });
    if (image) URL.revokeObjectURL(image.url);
    setText('');
    setImage(null);
  };

  const onImage = async (file?: File) => {
    if (!file) return;
    const blob = await compressImage(file);
    const key = `msg-img:${uid()}`;
    await putBlob(key, blob);
    if (image) {
      URL.revokeObjectURL(image.url);
      void deleteBlob(image.key);
    }
    setImage({ key, url: URL.createObjectURL(blob) });
  };

  const startRecording = async () => {
    setRecError(null);
    if (!canRecord()) {
      setRecError(t('teacher.noRecorder'));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
        const key = `msg-audio:${uid()}`;
        await putBlob(key, blob);
        await addParentMessage({ audioKey: key, audioMime: blob.type });
      };
      rec.start();
      recorderRef.current = rec;
      setRecording({ start: Date.now() });
    } catch {
      setRecError(t('teacher.micDenied'));
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(null);
  };

  return (
    <div className="flex flex-col gap-3" data-testid="teacher">
      <div className="rounded-xl border border-lilac-100 bg-lilac-50 p-3 text-sm font-semibold text-lilac-600" data-testid="teacher-banner">
        ⚠ ডেমো — কোনো বার্তা আসল শিক্ষকের কাছে যায় না / Demo — no messages are sent to a real teacher
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lilac-100 text-2xl" aria-hidden>
          🧕
        </div>
        <p className="font-bold text-ink">{t('teacher.name')}</p>
      </div>

      <ul className="flex flex-col gap-2" data-testid="messages">
        {(messages ?? []).map((m) => (
          <MessageBubble key={m.id} m={m} />
        ))}
      </ul>
      <div ref={endRef} />

      <div className="sticky bottom-20 space-y-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        {image && (
          <div className="flex items-center gap-2" data-testid="image-preview">
            <img src={image.url} alt={t('teacher.imagePreview')} className="h-16 w-16 rounded-lg object-cover" />
            <span className="text-xs text-muted">{t('teacher.imagePreview')}</span>
            <button
              type="button"
              className="ml-auto min-h-[44px] text-sm text-red-700"
              onClick={() => {
                URL.revokeObjectURL(image.url);
                void deleteBlob(image.key);
                setImage(null);
              }}
            >
              {t('teacher.remove')}
            </button>
          </div>
        )}
        {recError && <p className="text-sm text-peach-600" data-testid="rec-error">{recError}</p>}
        {recording ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-red-700">● {t('teacher.recording', { time: fmtClock(now - recording.start) })}</span>
            <Button variant="danger" onClick={stopRecording} className="ml-auto">
              ■ {t('teacher.stop')}
            </Button>
          </div>
        ) : (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('teacher.placeholder')}
              rows={2}
              data-testid="teacher-input"
              className="w-full rounded-xl border border-gray-300 p-2 text-base"
            />
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex min-h-[44px] cursor-pointer items-center rounded-xl border border-gray-300 px-3 text-sm font-semibold text-ink">
                📷 {t('teacher.attach')}
                <input type="file" accept="image/*" className="sr-only" data-testid="teacher-image" onChange={(e) => void onImage(e.target.files?.[0])} />
              </label>
              <Button variant="secondary" onClick={() => void startRecording()} testId="teacher-record">
                🎙️ {t('teacher.record')}
              </Button>
              <Button onClick={() => void send()} className="ml-auto" testId="teacher-send" disabled={!text.trim() && !image}>
                {t('teacher.send')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ m }: { m: TeacherMessage }) {
  const { t, lang } = useT();
  const img = useBlobUrl(m.imageKey);
  const audio = useBlobUrl(m.audioKey);
  const mine = m.from === 'parent';
  return (
    <li className={`max-w-[85%] rounded-2xl p-3 text-sm ${mine ? 'self-end bg-sage-600 text-white' : 'self-start bg-white text-ink shadow-sm'}`} data-testid="message" data-from={m.from}>
      {img && <img src={img} alt="" className="mb-2 max-h-48 rounded-xl" />}
      {audio && (
        <div className="mb-1">
          <p className="text-xs opacity-80">🎙️ {t('teacher.voiceNote')}</p>
          <audio controls src={audio} className="mt-1 w-56 max-w-full" />
        </div>
      )}
      {m.text && <p className={`whitespace-pre-wrap ${lang === 'bn' ? 'font-bn leading-[1.7]' : ''}`}>{m.text}</p>}
      <p className={`mt-1 text-[11px] ${mine ? 'text-white/80' : 'text-muted'}`}>
        {new Date(m.ts).toLocaleString(lang === 'bn' ? 'bn-IN' : 'en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        {m.demoAutoReply ? ' · DEMO' : ''}
      </p>
    </li>
  );
}
