import React from "react";
import { toast } from "react-toastify";

const DeleteConfirmModal = ({ deletingDoctor, refetch, setDeletingDoctor }) => {
  const { name, email } = deletingDoctor;

  const handleDelete = () => {
    const url = `http://localhost:5000/doctor/${email}`;
    fetch(url, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.deletedCount) {
          toast.success(`Doctor: ${name} is Deleted`);
          setDeletingDoctor(null);
          refetch();
        }
      });
  };
  return (
    <div>
      {/* <!-- The button to open modal --> */}

      {/* <!-- Put this part before </body> tag --> */}
      <input type="checkbox" id="delete-confirm-modal" class="modal-toggle" />
      <div class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3 class="font-bold text-lg text-red-500">
            Are you sure you want to delete {name}!
          </h3>
          <p class="py-4">If you delete once, you can't back it again !!!</p>
          <div class="modal-action">
            <button onClick={() => handleDelete()} class="btn btn-xs btn-error">
              Delete
            </button>
            <label for="delete-confirm-modal" class="btn btn-xs">
              Cancel
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
