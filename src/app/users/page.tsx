"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

const mockUsers = [
  { id: 1, name: "Jan Kowalski", email: "jan.kowalski@example.com", role: "Pracownik", team: "Developement" },
  { id: 2, name: "Anna Nowak", email: "anna.nowak@example.com", role: "HR", team: "HR" },
  { id: 3, name: "Piotr Wiśniewski", email: "piotr.wisniewski@example.com", role: "Administrator", team: "IT" },
  { id: 4, name: "Katarzyna Wójcik", email: "katarzyna.wojcik@example.com", role: "Księgowość", team: "Finanse" },
  { id: 5, name: "Marek Lewandowski", email: "marek.lewandowski@example.com", role: "Zarząd", team: "Zarząd" },
  { id: 6, name: "Zofia Dąbrowska", email: "zofia.dabrowska@example.com", role: "Pracownik", team: "Developement" },
];

const teams = ["Wszystkie", "Developement", "HR", "IT", "Finanse", "Zarząd"];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("Wszystkie");
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    let users = mockUsers;

    if (selectedTeam !== "Wszystkie") {
      users = users.filter(user => user.team === selectedTeam);
    }

    if (searchTerm) {
      users = users.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(users);
  }, [searchTerm, selectedTeam]);

  const handleSelectUser = (id: number) => {
    setSelectedUsers(prev =>
        prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  return (
      <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
        <main className="w-full max-w-6xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/profile/me" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <FaArrowLeft className="mr-2" />
              Powrót do pulpitu
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Zarządzanie Użytkownikami</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <button className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow cursor-pointer">
              <FaPlus className="mr-2" /> Dodaj użytkownika
            </button>
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                  type="text"
                  placeholder="Szukaj po imieniu, nazwisku lub emailu..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
            >
              {teams.map(team => <option key={team} value={team}>{team}</option>)}
            </select>
            {selectedUsers.length > 0 && (
                <button className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow cursor-pointer">
                  <FaTrash className="mr-2" /> Usuń zaznaczone ({selectedUsers.length})
                </button>
            )}
          </div>

          <div className="overflow-x-auto bg-white/50 rounded-lg shadow">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
              <tr>
                <th className="p-4 w-12"><input type="checkbox" className="h-4 w-4 cursor-pointer" /></th>
                <th className="p-4 font-semibold text-gray-600">Imię i nazwisko</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Rola</th>
                <th className="p-4 font-semibold text-gray-600">Zespół</th>
                <th className="p-4 font-semibold text-gray-600">Akcje</th>
              </tr>
              </thead>
              <tbody>
              {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50/50">
                    <td className="p-4"><input type="checkbox" className="h-4 w-4 cursor-pointer" checked={selectedUsers.includes(user.id)} onChange={() => handleSelectUser(user.id)} /></td>
                    <td className="p-4 text-gray-800">{user.name}</td>
                    <td className="p-4 text-gray-700">{user.email}</td>
                    <td className="py-4 pr-4 pl-2"><span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">{user.role}</span></td>
                    <td className="p-4 text-gray-700">{user.team}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors cursor-pointer border border-blue-200"><FaEdit size={16} /></button>
                        <button className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600 transition-colors cursor-pointer border border-red-200"><FaTrash size={16} /></button>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && <p className="text-center text-gray-500 mt-8">Nie znaleziono użytkowników pasujących do kryteriów.</p>}
        </main>
      </div>
  );
}

