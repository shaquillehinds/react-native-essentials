import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text, type TextProps } from 'react-native';
import { wait } from '../../utils';

export type TextStreamRef = {
  startStream: () => void;
  stopStream: () => void;
};

export type TextStreamProps = {
  ref?: React.Ref<TextStreamRef>;
  autoStream?: boolean;
  startStreamDelay?: number;
  streamCharacterDelay?: number;
  onStreamFinish?: () => void;
} & TextProps;

export function TextStream({
  ref,
  autoStream,
  onStreamFinish,
  startStreamDelay,
  streamCharacterDelay,
  children,
  ...rest
}: TextStreamProps) {
  const [streamed, setStreamed] = useState('');
  const [streamStart, setStreamStart] = useState(!!autoStream);
  const originalTextRef = useRef('');
  const lastLetterIndex = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      startStream: () => setStreamStart(true),
      stopStream: () => {
        setStreamStart(false);
        lastLetterIndex.current = 0;
      },
    }),
    []
  );

  useEffect(() => {
    (async () => {
      if (typeof children !== 'string' && !Array.isArray(children)) return;
      const textToStream =
        typeof children === 'string'
          ? children
          : children.reduce<string>((prev, curr) => {
              if (typeof curr === 'string') return prev + curr;
              else return prev;
            }, '');

      const originalTextCopy = originalTextRef.current || textToStream;
      originalTextRef.current = textToStream;

      let startIndex = lastLetterIndex.current;

      if (textToStream.length >= originalTextCopy.length) {
        startIndex = lastLetterIndex.current;
      } else {
        lastLetterIndex.current = textToStream.length - 1;
        onStreamFinish?.();
        setStreamed(textToStream);
        return setStreamStart(false);
      }
      if (streamStart || originalTextCopy !== textToStream) {
        await wait(startStreamDelay);
        for (let i = startIndex; i < textToStream.length; i++) {
          lastLetterIndex.current = i;
          if (textToStream.length !== originalTextRef.current.length) return;
          await wait(streamCharacterDelay || 15);
          setStreamed(textToStream.slice(0, i));
        }
      }
      setStreamed(textToStream);
      setStreamStart(false);
      onStreamFinish?.();
    })();
  }, [streamStart, children]);

  return <Text {...rest}>{streamed}</Text>;
}
