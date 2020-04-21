const core = require('@actions/core');
const github = require('@actions/github');
const tc = require('@actions/tool-cache');
const fs = require('fs');
const os = require('os');
const path = require('path');

async function run() {

  const ammonitePath = `.amm-bin`;

  try {
    const ammVersion = core.getInput('ammonite-version');
    const scalaVersion = core.getInput('scala-version');
    var cachedMillPath = tc.find('amm', ammVersion);
    if (!cachedMillPath) {
      core.info('no cached version found');
      core.info('downloading mill');
      const downloadPath = await tc.downloadTool(`https://github.com/lihaoyi/Ammonite/releases/download/${ammVersion}/${scalaVersion}-${ammVersion}`);
      await io.mkdirP(millPath);
      await io.cp(downloadPath, `${ammonitePath}/amm`, { force: true });
      fs.chmodSync(`${ammonitePath}/amm`, '0755')
      cachedMillPath = await tc.cacheDir(millPath, 'mill', millVersion);
    } else {
      core.info(`using cached version of mill: ${cachedMillPath}`);
    }
    core.addPath(cachedMillPath);

    // warm up ammonite
    await exec.exec('amm', ['--help']);
  }
  catch (error) {
    core.setFailed(error.message);
  }

}

run()
