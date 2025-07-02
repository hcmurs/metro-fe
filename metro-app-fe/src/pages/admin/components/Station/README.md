# Station Management

This directory contains components for managing metro stations in the admin panel.

## Components

### StationManagement.tsx
A comprehensive station management interface that provides:

#### Features
- **View All Stations**: Display stations in a responsive card grid layout
- **Search Functionality**: Search stations by name with real-time filtering
- **Add New Station**: Create new stations with complete information
- **Edit Station**: Update existing station details
- **Delete Station**: Remove stations with confirmation dialog
- **Status Indicators**: Visual status badges for active/inactive stations

#### Station Information Displayed
- Station Code
- Station Name
- Full Address
- GPS Coordinates (Latitude/Longitude)
- Route ID
- Sequence Order
- Status (Active/Inactive)
- Creation and Update Timestamps

#### Form Fields
When adding or editing a station, the following fields are available:
- **Station Code**: Unique identifier (e.g., ST001)
- **Station Name**: Display name of the station
- **Address**: Full physical address
- **Latitude**: GPS latitude coordinate
- **Longitude**: GPS longitude coordinate
- **Route ID**: Associated route identifier
- **Sequence Order**: Position in the route sequence

### Station.tsx (Legacy)
The original station component that displays route information and fare matrices.

## API Integration

The StationManagement component integrates with the following API endpoints:
- `GET /api/stations` - Fetch all stations
- `GET /api/stations/search?name={name}` - Search stations by name
- `POST /api/stations` - Create new station
- `PUT /api/stations/{id}` - Update existing station
- `DELETE /api/stations/{id}` - Delete station

## Navigation

Access the station management interface through:
1. Admin Panel → Station Management → Stations
2. URL: `/admin/stations`

## Usage

1. **Viewing Stations**: All stations are displayed in a card grid format
2. **Searching**: Use the search bar to filter stations by name
3. **Adding**: Click "Add Station" button and fill in the required information
4. **Editing**: Click "Edit" button on any station card
5. **Deleting**: Click "Delete" button and confirm the action

## Styling

The component uses Tailwind CSS for styling with:
- Responsive design (mobile-first approach)
- Hover effects and transitions
- Color-coded status indicators
- Modal dialogs for forms
- Loading states and empty states

## Icons

Utilizes Lucide React icons:
- `Plus` - Add new station
- `Edit` - Edit station
- `Trash2` - Delete station
- `Search` - Search functionality
- `MapPin` - Location indicator
- `Clock` - Timestamp display
- `CheckCircle` - Active status
- `XCircle` - Inactive status