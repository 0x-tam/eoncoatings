// Each content photograph belongs to one placement. Do not use service hero
// photographs as generic fallbacks on home, directory or industry pages.
export const collectionPhotos = ['collection-air','collection-surface','collection-fabric','collection-marble','collection-cleaning','collection-mattress','collection-exterior'].map(key=>`unique-care/${key}.webp`);
export const sectorPhotos:Record<string,{hero:string;heroAlt?:string;services:Record<number,{image:string;alt:string;copy:string}>}>={
 offices:{hero:'refreshed/office-working-v3.webp',heroAlt:'Eon Coatings technician cleaning inside an open ceiling AC duct; illustrative scene',services:{
  0:{image:'office-air',alt:'Ceiling AC in a corporate office',copy:'Duct cleaning, sanitisation and suitable mold-resistant protection for workplace AC systems.'},
  4:{image:'office-fabric',alt:'Upholstered conference chairs in a meeting room',copy:'Deep cleaning for meeting-room chairs, reception seating and office carpets.'},
  1:{image:'office-surface',alt:'Shared office desk with keyboard and telephone',copy:'Protective coating for suitable desks, counters and frequently touched shared surfaces.'}}},
 healthcare:{hero:'refreshed/clinic-working-v3.webp',heroAlt:'EON technician treating a clinic reception counter; illustrative scene',services:{
  1:{image:'clinic-surface',alt:'Clinic reception counter and shared payment terminal',copy:'Surface coating for suitable reception counters and touchpoints, alongside facility cleaning procedures.'},
  4:{image:'clinic-fabric',alt:'Upholstered waiting chairs in a clinic',copy:'Cleaning for waiting-area upholstery, matched to the fabric and facility requirements.'},
  0:{image:'clinic-air',alt:'Air grille above a healthcare consultation room',copy:'AC cleaning and protection planned around clinical access and operating requirements.'}}},
 education:{hero:'refreshed/school-working-v3.webp',heroAlt:'EON technician applying surface care to classroom desks; illustrative scene',services:{
  1:{image:'school-surface',alt:'Shared classroom desks with school supplies',copy:'Protective treatment for suitable desks, handles and shared classroom surfaces.'},
  4:{image:'school-fabric',alt:'Upholstered reading benches in a school library',copy:'Deep cleaning for library seating, reading corners and carpeted learning spaces.'},
  0:{image:'school-air',alt:'Air conditioner in a classroom',copy:'AC cleaning and suitable protective treatments, scheduled around teaching time.'}}},
 hospitality:{hero:'refreshed/hotel-working-v3.webp',heroAlt:'EON technician applying protective treatment to hotel bedside marble; illustrative scene',services:{
  2:{image:'hotel-fabric',alt:'Upholstered armchairs in a hotel lounge',copy:'Stain-resistant protection for suitable lobby chairs, lounge seating and guest-room upholstery.'},
  3:{image:'hotel-marble',alt:'Marble hotel reception counter',copy:'Protective coatings matched to reception stone, vanity tops and marble finishes.'},
  5:{image:'hotel-mattress',alt:'Guest-room mattress with housekeeping linen trolley',copy:'Mattress cleaning and sanitisation, with drying and room availability planned together.'},
  0:{image:'hotel-air',alt:'Linear AC vent in a hotel guest room',copy:'Duct cleaning and suitable protection for guest-room and shared-area AC systems.'}}}
};
