// Proxy to the Ticketmaster Discovery API so nearby events auto-populate the
// Concierge section. The API key stays server-side (TICKETMASTER_API_KEY) and
// is never exposed to the client. If no key is configured the endpoint returns
// { configured: false } so the UI can prompt to connect a provider.

module.exports = {
    index
};

// Default location: Mama Shelter LA (matches the coordinates used elsewhere).
const DEFAULT_LOCATION = { lat: 34.0996494, lng: -118.3334383 };
const DISCOVERY_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

async function index(req, res) {
    const key = process.env.TICKETMASTER_API_KEY;
    if (!key) {
        return res.json({ configured: false, events: [] });
    }

    const lat = req.query.lat || DEFAULT_LOCATION.lat;
    const lng = req.query.lng || DEFAULT_LOCATION.lng;
    const radius = req.query.radius || '25';

    const params = new URLSearchParams({
        apikey: key,
        latlong: `${lat},${lng}`,
        radius: String(radius),
        unit: 'miles',
        sort: 'date,asc',
        size: '24',
        startDateTime: new Date().toISOString().split('.')[0] + 'Z'
    });

    try {
        const upstream = await fetch(`${DISCOVERY_URL}?${params.toString()}`);
        if (!upstream.ok) {
            console.log('Ticketmaster upstream error', upstream.status);
            return res.status(502).json({ configured: true, events: [], error: 'Events provider returned an error' });
        }
        const data = await upstream.json();
        const events = ((data._embedded && data._embedded.events) || []).map(normalize);
        return res.json({ configured: true, events });
    } catch (err) {
        console.log('events fetch error', err);
        return res.status(502).json({ configured: true, events: [], error: 'Failed to reach events provider' });
    }
}

function normalize(e) {
    const venue = e._embedded && e._embedded.venues && e._embedded.venues[0];
    const images = e.images || [];
    const image = (images.find(i => i.ratio === '16_9' && i.width >= 640) || images[0] || {}).url;
    const cls = (e.classifications && e.classifications[0]) || {};
    const price = e.priceRanges && e.priceRanges[0];
    return {
        id: e.id,
        name: e.name,
        url: e.url,
        image,
        date: e.dates && e.dates.start && e.dates.start.localDate,
        time: e.dates && e.dates.start && e.dates.start.localTime,
        venue: venue && venue.name,
        city: venue && venue.city && venue.city.name,
        category: (cls.segment && cls.segment.name) || (cls.genre && cls.genre.name),
        priceRange: price ? `$${Math.round(price.min)}–$${Math.round(price.max)}` : null
    };
}
