# Change Log

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-12-27

### Added

- Subscribe and Unsubscribe server actions

### Changed

- Buttons on the homepage now reflect the users memberships status in the list.
- Note: an Owner of a list can be unsubscribed from their own list. this is the way that mailman works and it is weird for sure.
- TODO: Make owners automatic member on creation.

### Fixed

## [Unreleased] - 2025-12-26

Starting listsv2! Main page created with basic functions. Notably direct db access for faster access and search! Which GNU lacks.

### Added

- Direct DB Acess to Lists on Pigeon with Prisma documenting the tables

### Changed

- Changed from API access to direct DB login making for faster queries and integrated search thanks to postgressFullTextSearch.

### Fixed
