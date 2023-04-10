export const dialogTexts = {
  cancel: 'Anuluj',
  confirm: 'Kontynuuj',
  addVisitTitle: 'Zapisanie nowej wizyty',
  addVisitMessage: 'Czy na pewno chcesz zapisać wprowadzoną wizytę?',
  addSheetTitle: 'Zapisanie nowego harmonogramu',
  addSheetMessage: 'Czy na pewno chcesz importować nowy harmonogram?\n\n' +
    'Dodanie nowego harmonogramu wywoła następujące działania:\n' +
    '1. Usunięcie istniejących wizyt w zakresie dat nowego harmonogramu.\n' +
    '2. Utworzenie nowych wizyt w zakresie dat nowego harmonogramu ze statusem [Obecny].\n' +
    '3. Zapisanie w bazie danych beneficjentów oraz pracowników uczestniczących w wizytach.\n' +
    '4. Edycję czasu rozpoczęcia i/lub zakończenia kolidujących harmonogramów.\n',
  addAbsenceTitle: 'Zapisanie nowej nieobecności',
  addCustomerAbsenceMessage:
    'Czy na pewno chcesz zapisać wprowadzoną nieobecność?\n\n' +
    'Dodanie nieobecności wprowadzi modyfikacje w wizytach tego beneficjenta:\n' +
    '• Zmianę statusu wizyt z [Obecny] na status [Wizyta odwołana] w podanym zakresie dat.\n',
  addEmployeeAbsenceMessage:
    'Czy na pewno chcesz zapisać wprowadzoną nieobecność?\n\n' +
    'Dodanie nieobecności wprowadzi modyfikacje w wizytach u tego pracownika:\n' +
    '• Zmianę statusu wizyt z [Obecny] na status [Urlop] w podanym zakresie dat.\n',
  changeVisitTitle: 'Edycja wizyty',
  changeVisitMessage: 'Czy na pewno chcesz zapisać zmiany w szczegółach wizyty?',
  changeAbsenceTitle: 'Edycja nieobecności',
  changeCustomerAbsenceMessage:
    'Czy na pewno chcesz zapisać zmiany w szczegółach nieobecności?\n\n' +
    'Edycja zakresu dat nieobecności wprowadzi modyfikacje w wizytach tego beneficjenta:\n' +
    '• Zmianę statusu wizyt z [Wizyta odwołana] na status [Obecny] w poprzednim zakresie dat.\n' +
    '• Zmianę statusu wizyt z [Obecny] na status [Wizyta odwołana] w nowym zakresie dat.\n',
  changeEmployeeAbsenceMessage:
    'Czy na pewno chcesz zapisać zmiany w szczegółach nieobecności?\n\n' +
    'Edycja zakresu dat nieobecności wprowadzi modyfikacje w wizytach u tego pracownika:\n' +
    '• Zmianę statusu z [Urlop] na status [Obecny] w poprzednim zakresie dat.\n' +
    '• Zmianę statusu z [Obecny] na status [Urlop] w nowym zakresie dat.\n',
  deleteAbsenceTitle: 'Usuwanie nieobecności',
  deleteCustomerAbsenceMessage:
    'Czy na pewno chcesz usunąć nieobecność?\n\n' +
    'Usunięcie nieobecności wprowadzi modyfikacje w wizytach tego beneficjenta:\n' +
    '• Zmianę statusu wizyt z [Wizyta odwołana] na status [Obecny] w zakresie dat nieobecności.\n',
  deleteEmployeeAbsenceMessage:
    'Czy na pewno chcesz usunąć nieobecność?\n\n' +
    'Usunięcie nieobecności wprowadzi modyfikacje w wizytach u tego pracownika:\n' +
    '• Zmianę statusu z [Urlop] na status [Obecny] w zakresie dat nieobecności.\n',
  changeUserTitle: 'Edycja konta użytkownika',
  changeUserMessage: 'Czy napewno chcesz zapisać zmiany w szczegółach konta użytkownika?',
  addUserTitle: 'Tworzenie konta użytkownika',
  addUserMessage: 'Czy na pewno chcesz utworzyć nowe konto użytkownika',
  addReportTitle: 'Generowanie raportu',
  addReportMessage: 'Czy na pewno chcesz wygenerować raport? Sprawdź wybrane kolumny i zakres dat.'
};
