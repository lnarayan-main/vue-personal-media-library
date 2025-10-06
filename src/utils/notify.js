import { toast } from "vue3-toastify";

export default {
  success(msg) {
    toast.success(msg || "Success!");
  },
  error(msg) {
    toast.error(msg || "Something went wrong!");
  },
  info(msg) {
    toast.info(msg);
  },
};
