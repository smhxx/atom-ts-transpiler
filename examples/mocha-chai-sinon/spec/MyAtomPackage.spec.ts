import './helper';
import { Package, Panel } from 'atom';
import MyAtomPackage = require('../lib/MyAtomPackage');

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.

describe('MyAtomPackage', () => {
  let activation: Promise<Package>;
  let workspaceElement: HTMLElement;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activation = atom.packages.activatePackage('my-atom-package');
  });

  afterEach(async () => {
    await atom.packages.deactivatePackage('my-atom-package');
  });

  describe('when the my-atom-package:toggle event is triggered', () => {
    it('hides and shows the modal panel', async () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.my-atom-package')).not.to.exist;

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'my-atom-package:toggle');

      await activation;

      expect(workspaceElement.querySelector('.my-atom-package')).to.exist;

      const myPackageElement = workspaceElement.querySelector('.my-atom-package');
      expect(myPackageElement).to.exist;

      const myPackagePanel = atom.workspace.panelForItem(myPackageElement) as Panel;
      expect(myPackagePanel.isVisible()).to.be.true;
      atom.commands.dispatch(workspaceElement, 'my-atom-package:toggle');
      expect(myPackagePanel.isVisible()).to.be.false;
    });
  });
});
