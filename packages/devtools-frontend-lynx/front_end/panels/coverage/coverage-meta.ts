// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as i18n from '../../core/i18n/i18n.js';
import * as Root from '../../core/root/root.js';
import * as UI from '../../ui/legacy/legacy.js';

// eslint-disable-next-line rulesdir/es_modules_import
import type * as Coverage from './coverage.js';

const UIStrings = {
  /**
  *@description Title of the 'Coverage' tool in the bottom drawer
  */
  coverage: 'Coverage',
  /**
  *@description Command for showing the 'Coverage' tool in the bottom drawer
  */
  showCoverage: 'Show Coverage',
  /**
   *@description Title of an action under the Performance category that can be invoked through the Command Menu
  */
  instrumentCoverage: 'Instrument coverage',
  /**
   *@description Title of an action under the Performance category that can be invoked through the Command Menu
  */
  stopInstrumentingCoverageAndShow: 'Stop instrumenting coverage and show results',
  /**
   *@description Title of an action in the coverage tool to start with reload
  */
  startInstrumentingCoverageAnd: 'Start instrumenting coverage and reload page',
};
const str_ = i18n.i18n.registerUIStrings('panels/coverage/coverage-meta.ts', UIStrings);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);

let loadedCoverageModule: (typeof Coverage|undefined);

async function loadCoverageModule(): Promise<typeof Coverage> {
  if (!loadedCoverageModule) {
    // Side-effect import resources in module.json
    await Root.Runtime.Runtime.instance().loadModulePromise('panels/coverage');
    loadedCoverageModule = await import('./coverage.js');
  }
  return loadedCoverageModule;
}

// UI.ViewManager.registerViewExtension({
//   location: UI.ViewManager.ViewLocationValues.DRAWER_VIEW,
//   id: 'coverage',
//   title: i18nLazyString(UIStrings.coverage),
//   commandPrompt: i18nLazyString(UIStrings.showCoverage),
//   persistence: UI.ViewManager.ViewPersistence.CLOSEABLE,
//   order: 100,
//   async loadView() {
//     const Coverage = await loadCoverageModule();
//     return Coverage.CoverageView.CoverageView.instance();
//   },
// });

UI.ActionRegistration.registerActionExtension({
  actionId: 'coverage.toggle-recording',
  iconClass: UI.ActionRegistration.IconClass.LARGEICON_START_RECORDING,
  toggleable: true,
  toggledIconClass: UI.ActionRegistration.IconClass.LARGEICON_STOP_RECORDING,
  toggleWithRedColor: true,
  async loadActionDelegate() {
    const Coverage = await loadCoverageModule();
    return Coverage.CoverageView.ActionDelegate.instance();
  },
  category: UI.ActionRegistration.ActionCategory.PERFORMANCE,
  options: [
    {
      value: true,
      title: i18nLazyString(UIStrings.instrumentCoverage),
    },
    {
      value: false,
      title: i18nLazyString(UIStrings.stopInstrumentingCoverageAndShow),
    },
  ],
});

UI.ActionRegistration.registerActionExtension({
  actionId: 'coverage.start-with-reload',
  iconClass: UI.ActionRegistration.IconClass.LARGEICON_REFRESH,
  async loadActionDelegate() {
    const Coverage = await loadCoverageModule();
    return Coverage.CoverageView.ActionDelegate.instance();
  },
  category: UI.ActionRegistration.ActionCategory.PERFORMANCE,
  title: i18nLazyString(UIStrings.startInstrumentingCoverageAnd),
});
