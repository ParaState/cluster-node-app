import { IconButton } from '@mui/material';
import { Done as DoneIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';

import { useBoolean } from '@/hooks/use-boolean';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

type Props = {
  text: string;
};

export default function CopyButton({ text }: Props) {
  const { copy } = useCopyToClipboard();

  const copyHook = useBoolean(false);

  if (copyHook.value) {
    return (
      // <Tooltip title="Copied!">
      <IconButton>
        <DoneIcon />
      </IconButton>
      // </Tooltip>
    );
  }

  return (
    <IconButton
      onClick={() => {
        copy(text);
        copyHook.onTrue();

        setTimeout(() => {
          copyHook.onFalse();
        }, 3000);
      }}
    >
      <ContentCopyIcon />
    </IconButton>
  );
}
