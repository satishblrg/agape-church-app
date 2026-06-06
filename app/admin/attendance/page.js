"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import * as XLSX from "xlsx";
export default function AdminAttendancePage() {
  const [records, setRecords] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    const snapshot = await getDocs(collection(db, "attendance"));

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setRecords(data);
  };

  const deleteAttendance = async (id) => {
    await deleteDoc(doc(db, "attendance", id));
    setPopupMessage("Attendance record deleted successfully.");
    loadAttendance();
  };
   const exportToExcel = () => {
  const excelData = records.map((item) => ({
    Name: item.name || "",
    Date: item.date || "",
    "Login Time": item.loginTime || "",
    "Logout Time": item.logoutTime || "",
    "Total Minutes": item.totalMinutes || 0,
    Warnings: item.warnings || 0,
    Status: item.status || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  XLSX.writeFile(workbook, "Volunteer_Attendance.xlsx");
};
  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <div className="max-w-6xl mx-auto">
        <a
          href="/admin"
          className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold"
        >
          ← Back to Admin
        </a>

        <h1 className="mt-8 text-3xl font-black">Volunteer Attendance</h1>

        <p className="mt-2 text-white/60">
          View volunteer login, logout, total time, and attendance status.
        </p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
    <p className="text-sm text-white/60">Total Records</p>
    <h2 className="mt-2 text-3xl font-black">{records.length}</h2>
  </div>

  <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
    <p className="text-sm text-white/60">Active</p>
    <h2 className="mt-2 text-3xl font-black">
      {records.filter((item) => item.status === "Active").length}
    </h2>
  </div>

  <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
    <p className="text-sm text-white/60">Valid</p>
    <h2 className="mt-2 text-3xl font-black">
      {records.filter((item) => item.status === "Valid").length}
    </h2>
  </div>

  <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
    <p className="text-sm text-white/60">Suspicious</p>
    <h2 className="mt-2 text-3xl font-black">
      {records.filter((item) => item.status === "Suspicious").length}
    </h2>
  </div>
</div>

        <button
  onClick={exportToExcel}
  className="mt-5 rounded-2xl bg-green-600 px-6 py-3 font-bold"
>
  Download Excel
</button>

        <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-5">
  <label className="block text-sm font-bold text-purple-300">
    Filter by Date
  </label>

  <input
    type="date"
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
    className="mt-3 w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
  />

  <button
    onClick={() => setFilterDate("")}
    className="mt-3 rounded-2xl bg-purple-600 px-5 py-3 font-bold"
  >
    Clear Filter
  </button>
</div>

        <section className="mt-8 space-y-4">
          {records.length === 0 ? (
            <p className="text-white/60">No attendance records yet.</p>
          ) : (
            records
  .filter((item) => {
    if (!filterDate) return true;
    return item.date === new Date(filterDate).toLocaleDateString();
  })
  .map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/15 bg-white/10 p-5"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-xl font-black text-purple-300">
                    {item.name}
                  </h2>

                  <span
                    className={`rounded-full px-4 py-1 text-sm font-bold ${
                      item.status === "Suspicious"
                        ? "bg-red-600"
                        : item.status === "Active"
                        ? "bg-yellow-600"
                        : "bg-green-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-5 text-white/70">
                  <p>
                    <strong className="text-white">Date:</strong>
                    <br />
                    {item.date}
                  </p>

                  <p>
                    <strong className="text-white">Login:</strong>
                    <br />
                    {item.loginTime || "-"}
                  </p>

                  <p>
                    <strong className="text-white">Logout:</strong>
                    <br />
                    {item.logoutTime || "-"}
                  </p>

                  <p>
                    <strong className="text-white">Total Minutes:</strong>
                    <br />
                    {item.totalMinutes || 0}
                  </p>

                  <p>
                    <strong className="text-white">Warnings:</strong>
                    <br />
                    {item.warnings || 0}
                  </p>
                </div>

                <button
                  onClick={() => deleteAttendance(item.id)}
                  className="mt-5 rounded-2xl bg-red-600 px-5 py-3 font-bold"
                >
                  Delete Record
                </button>
              </div>
            ))
          )}
        </section>

        {popupMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0F172A] p-6 text-center shadow-2xl">
              <img
                src="/church-logo.png"
                alt="Agape Bible Church Logo"
                className="mx-auto h-24 w-24 object-contain"
              />

              <div className="mt-4 text-5xl">✅</div>

              <h2 className="mt-2 text-2xl font-black">Attendance</h2>

              <p className="mt-4 text-white/70 leading-7">{popupMessage}</p>

              <button
                onClick={() => setPopupMessage("")}
                className="mt-6 w-full rounded-2xl bg-purple-600 p-4 font-bold"
              >
                Okay
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}