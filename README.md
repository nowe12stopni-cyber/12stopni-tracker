# 12 Stopni — Panel Zarządzania
## Instrukcja wdrożenia na serwer (bez wiedzy technicznej)

---

## Opcja A: Railway.app — ZALECANA (darmowa, 5 minut)

### Krok 1: Załóż konto
1. Wejdź na **railway.app**
2. Kliknij **"Start a New Project"**
3. Zaloguj się przez GitHub (jeśli nie masz konta GitHub — załóż na github.com, to 2 minuty)

### Krok 2: Wgraj pliki
1. Na GitHub: kliknij **"+"** → **"New repository"**
2. Nazwa: `12stopni-tracker`
3. Kliknij **"uploading an existing file"**
4. Wgraj 3 pliki: `index.html`, `server.js`, `package.json`
5. Kliknij **"Commit changes"**

### Krok 3: Połącz z Railway
1. Na Railway kliknij **"New Project"** → **"Deploy from GitHub repo"**
2. Wybierz `12stopni-tracker`
3. Railway automatycznie wykryje Node.js i uruchomi serwer
4. Po ~2 minutach zobaczysz zielony status i **adres URL** (np. `12stopni-tracker.up.railway.app`)

### Krok 4: Ustaw hasło
1. W Railway kliknij na projekt → **"Variables"**
2. Dodaj zmienną: `API_SECRET` = `wynajem2026`
3. Railway automatycznie zrestartuje serwer

### Krok 5: Gotowe!
- Twój URL to np. `https://12stopni-tracker.up.railway.app`
- Wejdź na ten adres — pojawi się panel z hasłem `wynajem2026`
- Daj Marcie ten sam link i hasło
- Dane synchronizują się automatycznie co 30 sekund

---

## Opcja B: Render.com — alternatywa (też darmowa)

### Kroki:
1. Wejdź na **render.com** → **"New Web Service"**
2. Połącz z GitHub (tak samo jak wyżej)
3. W ustawieniach:
   - **Build Command**: (zostaw puste)
   - **Start Command**: `node server.js`
4. Dodaj zmienną środowiskową: `API_SECRET` = `wynajem2026`
5. Kliknij **"Create Web Service"**

---

## Jak działa synchronizacja?

```
Ty (Chrome)          Serwer (Railway)         Marta (Chrome)
    |                      |                       |
    |-- zapisujesz ----------> state.json <--------|
    |                      |                  co 30s pobiera
    |                      |                       |
    |<-- co 30s sprawdza ---|                       |
```

- Gdy **Ty** zmienisz dane → serwer zapisuje natychmiast
- Gdy **Marta** wejdzie → pobiera najnowszy stan
- Zielona kropka `• Sync` w górnym pasku = synchronizacja aktywna
- Brak kropki = pracujesz lokalnie (dane tylko u Ciebie)

---

## Backup danych

Stan systemu jest zapisany w pliku `state.json` na serwerze.
Na Railway możesz go pobrać przez **"Files"** w panelu projektu.

---

## Zmiana hasła

W Railway → Variables → zmień `API_SECRET` na nowe hasło.
Pamiętaj też zmienić hasło w pliku `index.html` (linia z `wynajem2026`).

