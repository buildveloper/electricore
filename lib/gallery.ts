/**
 * Project gallery data.
 *
 * Photos live in /public/imagesOfWork/client{N}/ and are referenced from here.
 * To add a photo: drop the file into the matching folder and add one line to
 * the photos array below.
 *
 * CAPTIONS: `title`, `scope` and `location` are intentionally left unset until
 * the actual scope of each job is confirmed. The gallery renders those fields
 * only when they are filled in, so nothing unverified is ever shown to a
 * visitor. Fill them in and the layout picks them up with no code changes.
 */

export type Project = {
  id: string;
  /** Shown as "PROJECT 01" in the gallery. */
  index: string;
  /** Optional once confirmed, e.g. "Panel Upgrade". */
  title?: string;
  /** Optional one line summary of the work performed. */
  scope?: string;
  /** Optional, e.g. "Dunn, NC". */
  location?: string;
  photos: string[];
};

const DIR = '/imagesOfWork';

export const projects: Project[] = [
  {
    id: 'project-1',
    index: '01',
    // title: 'Panel Upgrade',
    photos: [`${DIR}/client1/01.jpg`, `${DIR}/client1/02.jpg`, `${DIR}/client1/03.jpg`, `${DIR}/client1/04.jpg`],
  },
  {
    id: 'project-2',
    index: '02',
    // title: 'New Construction Wiring',
    photos: [
      `${DIR}/client2/01.jpg`,
      `${DIR}/client2/02.jpg`,
      `${DIR}/client2/03.jpg`,
      `${DIR}/client2/04.jpg`,
      `${DIR}/client2/05.jpg`,
      `${DIR}/client2/06.jpg`,
      `${DIR}/client2/07.jpg`,
      `${DIR}/client2/08.jpg`,
    ],
  },
  {
    id: 'project-3',
    index: '03',
    // title: 'Custom Lighting Installation',
    photos: [`${DIR}/client3/01.jpg`, `${DIR}/client3/02.jpg`, `${DIR}/client3/03.jpg`, `${DIR}/client3/04.jpg`],
  },
];

/** Honest, non-specific alt text until per-photo descriptions are supplied. */
export function photoAlt(project: Project, photoIndex: number): string {
  const subject = project.title ?? `Completed electrical work, project ${project.index}`;
  return `${subject} by ElectriCore, photo ${photoIndex + 1} of ${project.photos.length}`;
}
