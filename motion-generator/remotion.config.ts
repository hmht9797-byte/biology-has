import { Config } from '@remotion/cli/config';

// المتصفح: REMOTION_BROWSER إن وُجد (مثل chrome-headless-shell المحلي)، وإلا يحمّل Remotion نسخته
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(90);
Config.setCodec('h264');
Config.setCrf(23);
Config.setOverwriteOutput(true);
