import React from "react";
import { Modal } from "../../../shared/ui/modal/Modal.jsx";
import { t } from "../../../shared/i18n/dictionary";
import { TaskForm } from "./TaskForm.jsx";

export function TaskFormModal({ isOpen, onClose, onSubmit }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("actions.addTask")}>
      <TaskForm
        mode="create"
        onSubmit={(fields) => {
          onSubmit(fields);
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
}


