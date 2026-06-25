export async function getOwnerKosts() {
  return [
    {
      id: "1",
      name: "Kos Melati Putri",
      price: 700000,
      room_total: 10,
      room_available: 8,
      status: "available",
      facilities: ["Wifi", "AC", "Kamar Mandi Dalam"],
    },
    {
      id: "2",
      name: "Kos Mawar Putra",
      price: 850000,
      room_total: 12,
      room_available: 5,
      status: "available",
      facilities: ["Wifi", "Parkir", "CCTV"],
    },
  ];
}