/**
 * JSDoc template utilities for consistent API documentation
 * @module common/utils/jsdoc
 */

/**
 * Generates a standardized JSDoc parameter description for OR-constrained parameters
 *
 * @param params - Array of parameter names that are mutually exclusive
 * @returns JSDoc-formatted string describing the OR constraint
 *
 * @example
 * ```typescript
 * const doc = generateOrParamDoc(['teamID', 'teamAbv']);
 * // Returns: "Exactly one of: teamID, teamAbv (mutually exclusive)"
 * ```
 */
export function generateOrParamDoc(params: string[]): string {
  return `Exactly one of: ${params.join(', ')} (mutually exclusive)`;
}

/**
 * Generates a standardized JSDoc example block with Tank01 API key placeholder
 *
 * @param exampleCode - The example code snippet (without client instantiation)
 * @returns Complete JSDoc example block
 *
 * @example
 * ```typescript
 * const example = generateExampleBlock(`
 * const teams = await client.getNFLTeams({ rosters: true });
 * console.log(teams);
 * `);
 * ```
 */
export function generateExampleBlock(exampleCode: string): string {
  return `
/**
 * @example
 * \`\`\`typescript
 * import { Tank01Client } from '@tank01/nfl-client';
 * 
 * const client = new Tank01Client({
 *   apiKey: process.env.TANK01_API_KEY,
 * });
 * ${exampleCode.trim()}
 * \`\`\`
 */
`.trim();
}

/**
 * Generates JSDoc description for optional parameters with defaults
 *
 * @param paramName - Parameter name
 * @param defaultValue - Default value when parameter is omitted
 * @param description - Parameter description
 * @returns JSDoc-formatted parameter documentation
 *
 * @example
 * ```typescript
 * const doc = generateOptionalParamDoc('fantasyPoints', 'false', 'Include fantasy point data');
 * // Returns: "@param fantasyPoints - Include fantasy point data (optional, defaults to false)"
 * ```
 */
export function generateOptionalParamDoc(
  paramName: string,
  defaultValue: string,
  description: string
): string {
  return `@param ${paramName} - ${description} (optional, defaults to ${defaultValue})`;
}

/**
 * Generates JSDoc description for enum-style parameters
 *
 * @param paramName - Parameter name
 * @param validValues - Array of valid enum values
 * @param description - Parameter description
 * @returns JSDoc-formatted parameter documentation with valid values
 *
 * @example
 * ```typescript
 * const doc = generateEnumParamDoc('seasonType', ['reg', 'post', 'pre', 'all'], 'Type of season');
 * // Returns: "@param seasonType - Type of season. Valid values: "reg", "post", "pre", "all""
 * ```
 */
export function generateEnumParamDoc(
  paramName: string,
  validValues: string[],
  description: string
): string {
  const valuesStr = validValues.map((v) => `"${v}"`).join(', ');
  return `@param ${paramName} - ${description}. Valid values: ${valuesStr}`;
}

/**
 * Generates JSDoc description for date format parameters
 *
 * @param paramName - Parameter name
 * @param format - Date format string (e.g., 'YYYYMMDD')
 * @param description - Parameter description
 * @returns JSDoc-formatted parameter documentation with format
 *
 * @example
 * ```typescript
 * const doc = generateDateParamDoc('gameDate', 'YYYYMMDD', 'Date of the game');
 * // Returns: "@param gameDate - Date of the game (format: YYYYMMDD, e.g., "20241215")"
 * ```
 */
export function generateDateParamDoc(
  paramName: string,
  format: string,
  description: string
): string {
  const year = new Date().getFullYear();
  const exampleDate = format.replace('YYYY', String(year)).replace('MM', '12').replace('DD', '15');
  return `@param ${paramName} - ${description} (format: ${format}, e.g., "${exampleDate}")`;
}
