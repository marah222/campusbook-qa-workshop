/** Story S05: Partial booking overlap is rejected. Link to your real GitHub Issue. */
import {describe, test, expect } from 'vitest';
import { intervalsOverlap } from '../../../src/domain/booking.js';

// Student task: replace this TODO with a deterministic unit test.
// Use the hand-written test data. Suggested rule to investigate:
// R102 10:30–11:30, existing 10:00–11:00
// Ensure the assertion would FAIL if the business rule were violated.

import type { Period } from '../../../src/domain/types.js';
describe('QA:intervalsOverlap', () => {
  test('QA-1:intervalsOverlap_2sessionsOverlapExistingstartsAfterRequestedAndEndsAfterIt_true', () => {
    // Arrange
    const existing: Period = { start: '2027-03-18T10:00', end: '2027-03-18T12:00' };
    const requested: Period = { start: '2027-03-18T09:00', end: '2027-03-18T11:00' };

    // Act
    const hasOverlap = intervalsOverlap(existing, requested);

    // Assert
    expect(hasOverlap).toBe(true);
  });

  test('QA-2:intervalsOverlap_2sessionsOverlapExistingStartsBeforeRequestedAndEndsBeforeIt_true', () => {
    // Arrange
    const existing: Period = { start: '2027-03-18T10:00', end: '2027-03-18T12:00' };
    const requested: Period = { start: '2027-03-18T11:00', end: '2027-03-18T13:00' };

    // Act
    const hasOverlap = intervalsOverlap(existing, requested);

    // Assert
    expect(hasOverlap).toBe(true);
  });

  test('QA-3:intervalsOverlap_2sessionsOverlap_true,requestedCompletelyEncompassesExisting', () => {
    // Arrange
    const existing: Period = { start: '2027-03-18T10:00', end: '2027-03-18T12:00' };
    const requested: Period = { start: '2027-03-18T09:00', end: '2027-03-18T13:00' };

    // Act
    const hasOverlap = intervalsOverlap(existing, requested);

    // Assert
    expect(hasOverlap).toBe(true);
  });

  test('QA-4:intervalsNoOverlap_2sessionsOverlapBackToBack_False', () => {
    // Arrange
    const existing: Period = { start: '2027-03-18T10:00', end: '2027-03-18T12:00' };
    const requested: Period = { start: '2027-03-18T12:00', end: '2027-03-18T13:30' };

    // Act
    const hasOverlap = intervalsOverlap(existing, requested);

    // Assert
    expect(hasOverlap).toBe(false);
  });

  test('QA-5:intervalsNoOverlap_2sessionsNoOverlapWithSpace_False', () => {
    // Arrange
    const existing: Period = { start: '2027-03-18T10:00', end: '2027-03-18T12:00' };
    const requested: Period = { start: '2027-03-18T13:00', end: '2027-03-18T14:30' };

    // Act
    const hasOverlap = intervalsOverlap(existing, requested);

    // Assert
    expect(hasOverlap).toBe(false);
  });
});