export interface mandat {
  id: string;
  mandatenNummer: string;
  leitmandatsNummer: string;
  gesellschaft: string;
  wirtschaftsprüfungsgesellschaft: string;
  partner: string;
  manager: string;
  interneAnsprechpartner: string;
  rolle: string;
  branche: string;
  segment: string;
  risikoVertragspartner: string;
  statusUnvollständig: boolean;
  rollemandat: string;
  zuletztBearbeitet: string;
  erstelltAm: string;

  // Risikoanalyse-Felder
  risikoanalyse?: {
    finanzBuchhaltung: boolean;
    lohnGehaltsabrechnung: boolean;
    jahresabschluss: boolean;
    steuerErklärung: boolean;
    steuerBeratung: boolean;
    wirtschaftsBeratung: boolean;
    rechtsberatung: boolean;
    unternehmensbewertung: boolean;
    branche: string;
    bargeldIntensivesUnternehmen: boolean;
    niederlassungenInHochRisikoLand: boolean;
    politischExponiertePersonen: boolean;
  };
}
