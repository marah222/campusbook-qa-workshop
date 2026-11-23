# CampusBook: 4 features · 11 individual story objectives

**Do not hand students complete user stories or acceptance criteria.** Each objective below is a prompt for handwritten requirements analysis.

| ID | Team | Objective | Main test focus |
|---|---|---|---|
| S01 | A — Room Discovery | Room list hides inactive rooms | active vs inactive room rows |
| S02 | A — Room Discovery | Room capacity accepts its exact boundary | capacity 4 for group size 4 |
| S03 | A — Room Discovery | Existing confirmed booking affects room availability | confirmed R102 interval 10:00–11:00 |
| S04 | B — Room Booking | Valid booking request is accepted | R101 11:00–12:00, 1 person |
| S05 | B — Room Booking | Partial booking overlap is rejected | R102 10:30–11:30, existing 10:00–11:00 |
| S06 | B — Room Booking | Booking duration must be within policy | R101 11:00–13:30 exceeds 120 minutes |
| S07 | C — Cancellation | Owned confirmed booking can be cancelled | Alice owns BK-101 |
| S08 | C — Cancellation | Repeated cancellation does not change state | BK-103 starts cancelled |
| S09 | C — Cancellation | Cancelled reservations release availability | cancel BK-101, rebook R102 10:00–11:00 |
| S10 | D — My Reservations | Only current user can see their reservations | two demo accounts |
| S11 | D — My Reservations | Reservation filter matches the selected status | Alice has one cancelled and one confirmed booking |

## First hour
1. Students write independently (no AI), two candidate acceptance criteria, one question.
2. Teams challenge ambiguity and negotiate scope.
3. Instructor answers from the private product rules.
4. Each student creates a repository Issue and adds it to the CampusBook GitHub Project.
5. All 11 remain tracked; prioritize S03, S05, S09, S10 for deeper shared testing.

## Team ownership
- A: room listing and filtering only; does not create or cancel bookings.
- B: booking creation and validation; does not manage reservation history.
- C: cancellation lifecycle; can use booking API to verify slot release.
- D: current-user history and status filtering, read-only.
