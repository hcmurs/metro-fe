import { useState } from "react";

const fakeRoutes = [
  {
    route_id: 1,
    route_name: "Route A",
    route_code: "RTA001",
    distance: 12.4,
    quantity_station: 3,
    status: "active",
    stations: ["Station A1", "Station A2", "Station A3"],
  },
  {
    route_id: 2,
    route_name: "Route B",
    route_code: "RTB002",
    distance: 9.8,
    quantity_station: 4,
    status: "inactive",
    stations: ["Station B1", "Station B2", "Station B3", "Station B4"],
  },
];

const generateFareMatrix = (route: (typeof fakeRoutes)[0]) => {
  const matrix = [];
  for (let i = 0; i < route.stations.length; i++) {
    for (let j = 0; j < route.stations.length; j++) {
      if (i !== j) {
        matrix.push({
          origin: route.stations[i],
          destination: route.stations[j],
          distance: Math.abs(j - i) * 2 + 1, // đơn giản hóa
          fare: 5000 + Math.abs(j - i) * 2000,
        });
      }
    }
  }
  return matrix;
};

export default function Station() {
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  const closeModal = () => setSelectedRouteId(null);

  const selectedRoute = fakeRoutes.find((r) => r.route_id === selectedRouteId);
  const fareMatrix = selectedRoute ? generateFareMatrix(selectedRoute) : [];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {fakeRoutes.map((route) => (
          <div
            key={route.route_id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedRouteId(route.route_id)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {route.route_name}
              </h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  route.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {route.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium text-gray-700">Code:</span>{" "}
                {route.route_code}
              </p>
              <p>
                <span className="font-medium text-gray-700">Distance:</span>{" "}
                {route.distance} km
              </p>
              <p>
                <span className="font-medium text-gray-700">Stations:</span>{" "}
                {route.quantity_station}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-4xl w-full rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Fare Matrix - {selectedRoute.route_name}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 text-xl cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[70vh]">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Origin</th>
                    <th className="px-4 py-2 text-left">Destination</th>
                    <th className="px-4 py-2 text-left">Distance (km)</th>
                    <th className="px-4 py-2 text-left">Fare (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  {fareMatrix.map((fare, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{fare.origin}</td>
                      <td className="px-4 py-2">{fare.destination}</td>
                      <td className="px-4 py-2">{fare.distance.toFixed(1)}</td>
                      <td className="px-4 py-2">
                        {fare.fare.toLocaleString()}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t text-right">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
