const core = require('@actions/core');
const io = require('@actions/io');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const fs = require('fs');
const os = require('os');
const path = require('path');

async function run() {

  const ammonitePath = `.amm-bin`;

  try {
    const ammVersion = core.getInput('ammonite-version');
    const scalaVersion = core.getInput('scala-version');
    var cachedAmmonitePath = tc.find('amm', ammVersion);
    if (!cachedAmmonitePath) {
      core.info('no cached version found');
      core.info('downloading ammonite');
      const downloadPath = await tc.downloadTool(`https://github.com/lihaoyi/Ammonite/releases/download/${ammVersion}/${scalaVersion}-${ammVersion}`);
      await io.mkdirP(ammonitePath);
      const targetPath = process.platform === 'win32' ? `${ammonitePath}/amm.bat` : `${ammonitePath}/amm`;
      await io.cp(downloadPath, targetPath, { force: true });
      fs.chmodSync(targetPath, '0755')
      cachedAmmonitePath = await tc.cacheDir(ammonitePath, 'amm', ammonitePath);
    } else {
      core.info(`using cached version of amm: ${cachedAmmonitePath}`);
    }
   
    core.addPath(cachedAmmonitePath);

    // warm up ammonite
    await exec.exec('amm', ['--help']);
  }
  catch (error) {
    core.setFailed(error.message);
  }

}

run()
