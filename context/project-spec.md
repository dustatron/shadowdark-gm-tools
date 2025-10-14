# Shadowdark GM Tool - Website Specification

## Overview

A web-based tool for Shadowdark RPG Game Masters to search, browse, and organize monsters and spells for quick reference during gameplay.

## Target Users

- Game Masters running Shadowdark TTRPG sessions
- Users who need quick access to game content during sessions
- GMs who want to prepare and organize encounters

## Core Features

### 1. Monster Database

- **Browse/Search**: View all available monsters with search and filter capabilities
- **Monster Details**: Display complete stat blocks including:
  - Name and description
  - Armor Class (AC) and armor type
  - Hit Points (HP)
  - Movement speed (with special movement types like fly, swim, burrow, climb)
  - Attacks (with attack bonuses and damage)
  - Ability scores (STR, DEX, CON, INT, WIS, CHA)
  - Alignment (L=Lawful, N=Neutral, C=Chaotic)
  - Level
  - Traits/Special abilities
- **Search Filters**:
  - Filter by level (difficulty)
  - Filter by alignment
  - Filter by movement type (fly, swim, burrow, etc.)
  - Search by name or keywords in description
  - Filter by trait/ability names

### 2. Spell Database

- **Browse/Search**: View all available spells with search and filter capabilities
- **Spell Details**: Display complete spell information including:
  - Name and description (effect)
  - Tier (1-5, spell level)
  - Range (Self, Close, Near, Far, Unlimited)
  - Duration (Instant, Focus, rounds, hours, days)
  - Classes (wizard, priest, or both)
- **Search Filters**:
  - Filter by tier (1-5)
  - Filter by class (wizard, priest, both)
  - Filter by range
  - Filter by duration type
  - Search by name or keywords in description

### 3. Personal Lists/Collections

- **Save Functionality**: Allow users to save monsters and spells to personal lists
- **Multiple Lists**: Support creating multiple named lists (e.g., "Session 3 Encounters", "Dungeon Boss Pool")
- **Quick Reference**: Easy access to saved items during gameplay
- **List Management**: Add, remove, and organize saved items

### 4. User Interface Requirements

- **Clean, Simple Design**: Minimize distractions during gameplay
- **Mobile Responsive**: Usable on tablets and phones at the game table
- **Quick Search**: Prominent search bar on main pages
- **Fast Loading**: Optimize for quick lookup during sessions

## Technical Requirements

### Data Storage

- User accounts with secure authentication
- Cloud-based storage for personal lists
- Persistent data across devices

### Performance

- Fast search results (< 1 second)
- Offline capability (optional but recommended)
- Quick page loads

## Pages/Views

1. **Home/Dashboard**
   - Quick search bar
   - Access to monster and spell databases
   - View recent or favorite lists

2. **Monster Browser**
   - Searchable list of all monsters
   - Filter sidebar
   - Grid or list view of results

3. **Spell Browser**
   - Searchable list of all spells
   - Filter sidebar
   - Grid or list view of results

4. **Detail Pages**
   - Individual monster stat block view
   - Individual spell detail view
   - "Save to List" button

5. **My Lists**
   - View all personal lists
   - Create/delete lists
   - Manage list contents

6. **User Account**
   - Login/signup
   - Profile settings
   - Account management

## Future Enhancements (Phase 2)

- Encounter builder with CR calculation
- Dice roller integration
- Share lists with other users
- Custom monster/spell creation
- Session notes integration
- Initiative tracker

## Data Structure

### Monster Data Fields (from existing JSON)

Based on the open-shadowdark repository data:

- `name`: Monster name (string)
- `slug`: URL-friendly identifier (string)
- `description`: Flavor text (string)
- `armor_class`: AC value (number)
- `armor_type`: Type of armor or null (string/null)
- `hit_points`: HP value (number)
- `attacks`: Attack description with bonuses and damage (string)
- `movement`: Movement speed and special types (string)
- `strength`: STR modifier (number)
- `dexterity`: DEX modifier (number)
- `constitution`: CON modifier (number)
- `intelligence`: INT modifier (number)
- `wisdom`: WIS modifier (number)
- `charisma`: CHA modifier (number)
- `alignment`: L, N, or C (string)
- `level`: Monster level/difficulty (number)
- `traits`: Array of special abilities/traits
  - Each trait has `name` and `description`

### Data Source

- **Initial Data**: GitHub repository at `https://github.com/ashleytowner/open-shadowdark`
- **Content Format**: JSON files with structured monster data
- **License Compliance**: Ensure proper attribution and compliance with Shadowdark third-party license

## Success Metrics

- Quick lookup time during sessions
- User retention and repeat usage
- Number of saved lists per user
- Search functionality effectiveness

the raw data sources can be found under ./coreData
