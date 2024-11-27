import { createAction } from "@reduxjs/toolkit";

const updateBooking = createAction("updateBooking");
const clearBooking = createAction("clearBooking");

export { updateBooking, clearBooking };
