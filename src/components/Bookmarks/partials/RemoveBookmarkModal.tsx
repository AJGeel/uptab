import { Bookmarks as BookmarksApi } from "webextension-polyfill";

import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";

type Props = {
  /** The bookmark to remove. Shown while there is one. */
  bookmark?: BookmarksApi.BookmarkTreeNode;
  onCancel: () => void;
  onConfirm: () => void;
};

const RemoveBookmarkModal = ({ bookmark, onCancel, onConfirm }: Props) => (
  <Modal
    isVisible={!!bookmark}
    onClose={onCancel}
    title="Ready to say goodbye?"
    subtitle={
      <>
        <strong className="font-semibold">{bookmark?.title}</strong> is about to
        vanish from your browser&apos;s bookmarks too. No take-backs.
      </>
    }
    footer={
      <div className="flex items-center justify-end gap-2">
        <Button
          label="Phew, keep it!"
          variant={buttonVariants.secondary}
          onClick={onCancel}
        />
        <Button
          label="Bye bye, bookmark!"
          className="bg-red-500 ring-red-500"
          onClick={onConfirm}
        />
      </div>
    }
  />
);

export default RemoveBookmarkModal;
