import response from "../../../utils/response.js";
import ExportService from "../producers/exportServices.js";

export const exportNotes = async (req, res) => {
  const { targetEmail } = req.validated;

  const message = {
    userId: req.user.id,
    targetEmail,
  };

  await ExportService.sendMessage("export:books", JSON.stringify(message));
  return response(res, 201, "Permintaan export buku dalam antrean");
};
