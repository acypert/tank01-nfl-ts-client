import { describe, it, expect } from 'vitest';
import { validateOneOf } from '../parameters.js';

describe('validateOneOf', () => {
  describe('valid cases', () => {
    it('should pass when exactly one parameter is provided', () => {
      expect(() => {
        validateOneOf(['teamID', 'teamAbv'], { teamID: '5' });
      }).not.toThrow();
    });

    it('should pass when exactly one of three parameters is provided', () => {
      expect(() => {
        validateOneOf(['playerName', 'playerID', 'playerSlug'], { playerID: 4381786 });
      }).not.toThrow();
    });

    it('should pass when parameter value is 0 (falsy but valid)', () => {
      expect(() => {
        validateOneOf(['gameID', 'gameDate'], { gameID: 0 });
      }).not.toThrow();
    });

    it('should pass when parameter value is false (falsy but valid)', () => {
      expect(() => {
        validateOneOf(['param1', 'param2'], { param1: false });
      }).not.toThrow();
    });
  });

  describe('invalid cases - none provided', () => {
    it('should throw when no parameters are provided', () => {
      expect(() => {
        validateOneOf(['teamID', 'teamAbv'], {});
      }).toThrow(TypeError);
    });

    it('should throw with descriptive message when no parameters provided', () => {
      expect(() => {
        validateOneOf(['teamID', 'teamAbv'], {}, 'getNFLTeamRoster');
      }).toThrow('getNFLTeamRoster requires exactly one of: teamID, teamAbv (received: none)');
    });

    it('should throw when parameters are undefined', () => {
      expect(() => {
        validateOneOf(['playerName', 'playerID'], { playerName: undefined, playerID: undefined });
      }).toThrow(TypeError);
    });

    it('should throw when parameters are null', () => {
      expect(() => {
        validateOneOf(['gameDate', 'gameID'], { gameDate: null, gameID: null });
      }).toThrow(TypeError);
    });

    it('should throw when parameters are empty strings', () => {
      expect(() => {
        validateOneOf(['teamID', 'teamAbv'], { teamID: '', teamAbv: '' });
      }).toThrow(TypeError);
    });
  });

  describe('invalid cases - multiple provided', () => {
    it('should throw when two parameters are provided', () => {
      expect(() => {
        validateOneOf(['teamID', 'teamAbv'], { teamID: '5', teamAbv: 'SF' });
      }).toThrow(TypeError);
    });

    it('should throw with descriptive message when multiple parameters provided', () => {
      expect(() => {
        validateOneOf(
          ['gameDate', 'gameID'],
          { gameDate: '20241215', gameID: '12345' },
          'getNFLBettingOdds'
        );
      }).toThrow(
        'getNFLBettingOdds requires exactly one of: gameDate, gameID (received: gameDate, gameID)'
      );
    });

    it('should throw when all three of three parameters are provided', () => {
      expect(() => {
        validateOneOf(['param1', 'param2', 'param3'], { param1: 'a', param2: 'b', param3: 'c' });
      }).toThrow(TypeError);
    });
  });

  describe('context parameter', () => {
    it('should include context in error message when provided', () => {
      expect(() => {
        validateOneOf(['playerName', 'playerID'], {}, 'getNFLPlayerInfo');
      }).toThrow('getNFLPlayerInfo requires exactly one of');
    });

    it('should work without context parameter', () => {
      expect(() => {
        validateOneOf(['teamID', 'teamAbv'], {});
      }).toThrow('requires exactly one of: teamID, teamAbv');
    });
  });

  describe('edge cases', () => {
    it('should handle single parameter in array', () => {
      expect(() => {
        validateOneOf(['onlyParam'], { onlyParam: 'value' });
      }).not.toThrow();
    });

    it('should handle parameter names with special characters', () => {
      expect(() => {
        validateOneOf(['param-1', 'param_2'], { 'param-1': 'value' });
      }).not.toThrow();
    });

    it('should ignore extra parameters not in the validation list', () => {
      expect(() => {
        validateOneOf(['teamID', 'teamAbv'], { teamID: '5', extraParam: 'ignored' });
      }).not.toThrow();
    });
  });
});
