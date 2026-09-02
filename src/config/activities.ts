import type { ActivityConfig } from '@/types'
import { ACTIVITY_PRICES, SEAT_CAPS } from '@/lib/constants'

export const ACTIVITIES: ActivityConfig[] = [
  {
    slug:        'cyclathon',
    name:        'Cyclathon',
    shortName:   'Cycle',
    description: 'Tackle Dar es Salaam\'s coastline on two wheels. Our flagship ride covers 60km of scenic coastal roads with aid stations every 15km. All levels welcome — from recreational riders to competitive cyclists.',
    icon:        'Bike',
    color:       'gold',
    distance:    '60km',
    priceMin:    ACTIVITY_PRICES.cyclathon.standard,
    priceMax:    ACTIVITY_PRICES.cyclathon.vip,
    seatCap:     SEAT_CAPS.cyclathon,
    category:    'cycling',
  },
  {
    slug:        'marathon',
    name:        'Marathon',
    shortName:   'Run',
    description: 'A full 42km marathon through Dar es Salaam\'s most iconic streets. Chip-timed and AIMS-standard route, with pacers for every finish-time goal.',
    icon:        'Footprints',
    color:       'magenta',
    distance:    '42km',
    priceMin:    ACTIVITY_PRICES.marathon.standard,
    priceMax:    ACTIVITY_PRICES.marathon.vip,
    seatCap:     SEAT_CAPS.marathon,
    category:    'running',
  },
  {
    slug:        'walkathon',
    name:        'Walkathon',
    shortName:   'Walk',
    description: 'A 10km walkathon connecting the heart of the city. Perfect for families, first-timers, and anyone who wants to make a difference one step at a time.',
    icon:        'PersonStanding',
    color:       'navy',
    distance:    '10km',
    priceMin:    ACTIVITY_PRICES.walkathon.standard,
    seatCap:     SEAT_CAPS.walkathon,
    category:    'walking',
  },
  {
    slug:        'zumba',
    name:        'Zumba',
    shortName:   'Zumba',
    description: 'A high-energy 60-minute Zumba session led by Dar es Salaam\'s top instructors. Dance your way to a cause with Latin rhythms and Bongo Flava beats.',
    icon:        'Music2',
    color:       'magenta',
    duration:    '60 min',
    priceMin:    ACTIVITY_PRICES.zumba.standard,
    seatCap:     SEAT_CAPS.zumba,
    category:    'fitness',
  },
  {
    slug:        'yoga',
    name:        'Yoga',
    shortName:   'Yoga',
    description: 'Sunrise yoga on the shores of the Indian Ocean. A 60-minute flow session designed for all levels — the perfect way to move with mindfulness.',
    icon:        'Sunset',
    color:       'gold',
    duration:    '60 min',
    priceMin:    ACTIVITY_PRICES.yoga.standard,
    seatCap:     SEAT_CAPS.yoga,
    category:    'fitness',
  },
  {
    slug:        'community_walk',
    name:        'Community Walk',
    shortName:   'Community',
    description: 'A 5km solidarity walk open to everyone — young, old, and everyone in between. This is the heartbeat of Tour de Rotary DSM, celebrating community above all.',
    icon:        'Users',
    color:       'navy',
    distance:    '5km',
    priceMin:    ACTIVITY_PRICES.community_walk.standard,
    seatCap:     SEAT_CAPS.community_walk,
    category:    'walking',
  },
]

// Map for O(1) lookup
export const ACTIVITY_MAP = Object.fromEntries(
  ACTIVITIES.map(a => [a.slug, a])
) as Record<string, ActivityConfig>
