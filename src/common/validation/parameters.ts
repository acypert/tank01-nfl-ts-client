/**
 * Parameter validation utilities for Tank01 NFL API client
 * @module common/validation/parameters
 */

/**
 * Validates that exactly one of the specified parameters is provided in the options object.
 * Throws a TypeError if zero or more than one parameter is provided.
 *
 * @param parameterNames - Array of parameter names to check (e.g., ['teamID', 'teamAbv'])
 * @param options - The options object containing parameters
 * @param context - Optional context string for error messages (e.g., 'getNFLTeamRoster')
 * @throws {TypeError} When exactly one parameter is not provided
 *
 * @example
 * ```typescript
 * // Valid: exactly one parameter provided
 * validateOneOf(['teamID', 'teamAbv'], { teamID: '5' }, 'getNFLTeamRoster');
 *
 * // Invalid: both parameters provided
 * validateOneOf(['teamID', 'teamAbv'], { teamID: '5', teamAbv: 'SF' }, 'getNFLTeamRoster');
 * // Throws: TypeError: getNFLTeamRoster requires exactly one of: teamID, teamAbv (received: teamID, teamAbv)
 *
 * // Invalid: neither parameter provided
 * validateOneOf(['teamID', 'teamAbv'], {}, 'getNFLTeamRoster');
 * // Throws: TypeError: getNFLTeamRoster requires exactly one of: teamID, teamAbv (received: none)
 * ```
 */
export function validateOneOf(
  parameterNames: string[],
  options: Record<string, unknown>,
  context?: string
): void {
  const providedParams = parameterNames.filter(
    (param) => options[param] !== undefined && options[param] !== null && options[param] !== ''
  );

  if (providedParams.length === 0) {
    const contextStr = context ? `${context} ` : '';
    throw new TypeError(
      `${contextStr}requires exactly one of: ${parameterNames.join(', ')} (received: none)`
    );
  }

  if (providedParams.length > 1) {
    const contextStr = context ? `${context} ` : '';
    throw new TypeError(
      `${contextStr}requires exactly one of: ${parameterNames.join(', ')} (received: ${providedParams.join(', ')})`
    );
  }
}
