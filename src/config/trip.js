export const TRIP = {
  title: 'Countdown to Halifax',
  route: 'EWR → YHZ',
  from: 'EWR',
  to: 'YHZ',
  passenger: 'Jayu → Suhu',
  confirmation: 'AB12CD',

  countdownTarget: '2026-11-18T13:00:00-05:00',
  displayDate: 'Wednesday, November 18, 2026 at 1:00 PM',

  heroSubtitle:
    'Every second closer to the next trip, the next hug, and the next memory.',
};

export const FLIGHTS = [
  {
    id: 'departure',
    label: 'Departure Flight',
    badge: 'Outbound',

    from: 'EWR',
    fromName: 'Newark Liberty Intl.',
    to: 'YHZ',
    toName: 'Halifax Stanfield Intl.',

    date: 'Wednesday, November 18, 2026',
    departTime: '1:00 PM',
    arriveTime: '2:42 PM',
    duration: '1h 42m',

    flightNumber: 'AC 621',
    airline: 'Air Canada',
    aircraft: 'Airbus A220-300',
    cabin: 'Economy',
    terminal: 'Terminal A',
    gate: 'TBD',
    confirmation: 'AB12CD',

    checkIn: [
      'Check in opens 24 hours before departure.',
      'Use the Air Canada app or website.',
      'Arrive at the airport at least 2 hours before departure.',
      'Keep passport or government ID ready.',
    ],

    baggage: [
      'Review carry-on and checked bag rules before leaving.',
      'Keep chargers, ID, wallet, and essentials in personal item.',
      'Double-check liquids before security.',
    ],
  },

  {
    id: 'return',
    label: 'Return Flight',
    badge: 'Back home',

    from: 'YHZ',
    fromName: 'Halifax Stanfield Intl.',
    to: 'EWR',
    toName: 'Newark Liberty Intl.',

    date: 'Return date TBD',
    departTime: '12:30 PM',
    arriveTime: '2:18 PM',
    duration: '1h 48m',

    flightNumber: 'AC 622',
    airline: 'Air Canada',
    aircraft: 'Airbus A220-300',
    cabin: 'Economy',
    terminal: 'Terminal 1',
    gate: 'TBD',
    confirmation: 'AB12CD',

    checkIn: [
      'Check in opens 24 hours before return departure.',
      'Confirm the return date and time before the trip.',
      'Arrive at YHZ with enough time for baggage and security.',
      'Keep travel documents easy to reach.',
    ],

    baggage: [
      'Pack souvenirs safely before leaving.',
      'Make sure nothing is left at the stay/place.',
      'Keep anything fragile in carry-on if possible.',
    ],
  },
];