/**
 * NFL Team entity
 */
export interface Team {
  /** Unique team identifier/abbreviation (e.g., "KC", "PHI") */
  teamID: string;
  /** Full team name (e.g., "Kansas City Chiefs") */
  teamName: string;
  /** Team's city */
  teamCity: string;
  /** Team abbreviation */
  teamAbv: string;
  /** Conference: "AFC" or "NFC" */
  conference: 'AFC' | 'NFC';
  /** Division: "North", "South", "East", or "West" */
  division: 'North' | 'South' | 'East' | 'West';
  /** Season wins */
  wins?: number | undefined;
  /** Season losses */
  losses?: number | undefined;
  /** Season ties */
  ties?: number | undefined;
  /** Current season year */
  seasonYear?: string | undefined;
}
