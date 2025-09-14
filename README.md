# 🧭 FlowManager

**FlowManager** to nowoczesny system do kompleksowego zarządzania projektami, personelem, czasem pracy oraz kosztami operacyjnymi. Został zaprojektowany z myślą o organizacjach, które potrzebują narzędzia wspierającego efektywne planowanie, monitorowanie i analizę danych związanych z działalnością projektową i HR.

---

## 📌 Kluczowe funkcje

- Zarządzanie użytkownikami i rolami (HR, Administracja, Księgowość, Pracownik)
- Rejestracja czasu pracy z podziałem na projekty i zadania
- Ewidencja nadgodzin i nieobecności
- Planowanie projektów oraz przypisywanie zadań
- Obsługa wniosków urlopowych z kalendarzem urlopowym
- Generowanie raportów operacyjnych i strategicznych
- Monitorowanie kosztów projektów i wynagrodzeń
- Statystyki finansowe i dashboard w czasie rzeczywistym
- Profil pracownika z historią zadań i projektów

---

## 🛠️ Stack technologiczny

| Warstwa      | Technologia                                                                      |
|--------------|-----------------------------------------------------------------------------------|
| Frontend     | [Next.js](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| UI / Design  | [Tailwind CSS 4](https://tailwindcss.com/)                                       |
| Backend      | Next.js API Routes / Server Actions (TypeScript)                                 |
| Baza danych  | [PostgreSQL](https://www.postgresql.org/) hostowany na [Neon](https://neon.com/) (serverless)                                        |
| ORM          | [Prisma ORM](https://www.prisma.io/)                                             |
| Dev Tools    | ESLint, Prettier, Commitlint, Vitest                                             |
| Hosting      | Vercel                                                                           |

---

## 📁 Struktura projektu

```
src/
├── app/                     # App Router (Next.js 15+)
│   ├── api/                 # API routes (backend logic)
│   ├── dashboard/           # Główna aplikacja (po zalogowaniu)
│   └── login/               # Widok logowania
├── components/              # Komponenty UI
├── hooks/                   # Hooki (np. auth, state management)
├── lib/                     # Utils, helpers, middlewares
├── prisma/                  # Schematy i seed bazy danych
├── styles/                  # Tailwind i globalne style
└── types/                   # Typy TypeScript
```

---

## 🚀 Jak uruchomić lokalnie

### 1. Sklonuj repozytorium

```bash
git clone [https://github.com/twoj-user/flow_manager.git](https://github.com/TeatrumMundi/flow_manager.git)
cd flow_manager
```

### 2. Zainstaluj zależności

```bash
pnpm install
# lub
npm install
```

### 3. Skonfiguruj środowisko

Utwórz plik `.env` na podstawie `.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/flow_manager (example)
```

### 4. Zainicjuj bazę danych

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Uruchom aplikację

```bash
pnpm dev
# lub
npm run dev
```

---

## 🧪 Testy

Projekt korzysta z [Vitest](https://vitest.dev/). Aby uruchomić testy:

```bash
pnpm test
```

---
