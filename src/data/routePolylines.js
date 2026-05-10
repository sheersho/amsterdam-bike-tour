/**
 * Mock route polyline data for Phase 1 in-browser navigation.
 *
 * Each entry is keyed as "fromStopId-toStopId" and contains:
 *   curated  – orange scenic route (bike-friendly canals)
 *   fastest  – grey direct route
 *   instruction – first cue shown in the info panel
 *   distance – approximate metres
 *   duration – approximate riding minutes
 */

export const ROUTE_SEGMENTS = {
  '1-2': {
    instruction: 'Head south on Damrak towards Dam Square',
    distance: 620,
    duration: 3,
    curated: [
      [52.3791, 4.9003],
      [52.3778, 4.8980],
      [52.3762, 4.8957],
      [52.3748, 4.8942],
      [52.3730, 4.8933],
    ],
    fastest: [
      [52.3791, 4.9003],
      [52.3760, 4.8965],
      [52.3730, 4.8933],
    ],
  },
  '2-3': {
    instruction: 'Take Raadhuisstraat west along the canal ring',
    distance: 1100,
    duration: 5,
    curated: [
      [52.3730, 4.8933],
      [52.3735, 4.8910],
      [52.3745, 4.8886],
      [52.3758, 4.8862],
      [52.3770, 4.8850],
      [52.3785, 4.8844],
    ],
    fastest: [
      [52.3730, 4.8933],
      [52.3755, 4.8880],
      [52.3785, 4.8844],
    ],
  },
  '3-4': {
    instruction: 'Ride south on Prinsengracht to Anne Frank House',
    distance: 370,
    duration: 2,
    curated: [
      [52.3785, 4.8844],
      [52.3775, 4.8841],
      [52.3763, 4.8840],
      [52.3752, 4.8840],
    ],
    fastest: [
      [52.3785, 4.8844],
      [52.3752, 4.8840],
    ],
  },
  '4-5': {
    instruction: 'Follow Prinsengracht south into the Nine Streets',
    distance: 680,
    duration: 3,
    curated: [
      [52.3752, 4.8840],
      [52.3738, 4.8840],
      [52.3720, 4.8840],
      [52.3705, 4.8840],
      [52.3695, 4.8840],
    ],
    fastest: [
      [52.3752, 4.8840],
      [52.3720, 4.8840],
      [52.3695, 4.8840],
    ],
  },
  '5-6': {
    instruction: 'Head south-west through Jordaan towards Vondelpark',
    distance: 1800,
    duration: 8,
    curated: [
      [52.3695, 4.8840],
      [52.3675, 4.8810],
      [52.3655, 4.8775],
      [52.3630, 4.8735],
      [52.3605, 4.8705],
      [52.3580, 4.8686],
    ],
    fastest: [
      [52.3695, 4.8840],
      [52.3645, 4.8765],
      [52.3580, 4.8686],
    ],
  },
  '6-7': {
    instruction: 'Exit Vondelpark east towards Museumplein',
    distance: 650,
    duration: 3,
    curated: [
      [52.3580, 4.8686],
      [52.3580, 4.8730],
      [52.3582, 4.8775],
      [52.3585, 4.8810],
      [52.3590, 4.8832],
    ],
    fastest: [
      [52.3580, 4.8686],
      [52.3586, 4.8760],
      [52.3590, 4.8832],
    ],
  },
  '7-8': {
    instruction: 'Ride north-east along Amstel towards Skinny Bridge',
    distance: 1500,
    duration: 7,
    curated: [
      [52.3590, 4.8832],
      [52.3605, 4.8870],
      [52.3615, 4.8910],
      [52.3622, 4.8950],
      [52.3630, 4.8990],
      [52.3637, 4.9024],
    ],
    fastest: [
      [52.3590, 4.8832],
      [52.3615, 4.8930],
      [52.3637, 4.9024],
    ],
  },
  '8-9': {
    instruction: 'Cross the Skinny Bridge, then west along the Amstel',
    distance: 820,
    duration: 4,
    curated: [
      [52.3637, 4.9024],
      [52.3645, 4.9005],
      [52.3653, 4.8978],
      [52.3660, 4.8955],
      [52.3668, 4.8929],
    ],
    fastest: [
      [52.3637, 4.9024],
      [52.3655, 4.8975],
      [52.3668, 4.8929],
    ],
  },
  '9-10': {
    instruction: 'Head north through the old centre to the Red Light District',
    distance: 890,
    duration: 4,
    curated: [
      [52.3668, 4.8929],
      [52.3685, 4.8935],
      [52.3705, 4.8952],
      [52.3720, 4.8968],
      [52.3741, 4.8990],
    ],
    fastest: [
      [52.3668, 4.8929],
      [52.3705, 4.8962],
      [52.3741, 4.8990],
    ],
  },
  // Wrap-around: last stop back to first (circular tour)
  '10-1': {
    instruction: 'Ride north along Warmoesstraat back to Central Station',
    distance: 680,
    duration: 3,
    curated: [
      [52.3741, 4.8990],
      [52.3752, 4.8995],
      [52.3765, 4.8998],
      [52.3780, 4.9000],
      [52.3791, 4.9003],
    ],
    fastest: [
      [52.3741, 4.8990],
      [52.3765, 4.8997],
      [52.3791, 4.9003],
    ],
  },
};

/** Look up segment data for a given from→to stop pair */
export function getSegment(fromStopId, toStopId) {
  const key = `${fromStopId}-${toStopId}`;
  return ROUTE_SEGMENTS[key] || null;
}
