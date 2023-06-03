import { testEnvVar } from '../settings';

export const indexPage = (req, res) => res.status(200).json({ message: testEnvVar });
