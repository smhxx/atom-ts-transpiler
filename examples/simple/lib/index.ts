import { CompositeDisposable, Panel } from "atom";
import MyAtomPackageView from "./views/MyAtomPackageView";

let modalPanel: Panel;
let myAtomPackageView: MyAtomPackageView;
let subscriptions: CompositeDisposable;

interface ISerializedState {
  myAtomPackageViewState?: object;
}

export function activate(state: ISerializedState): void {
  myAtomPackageView = new MyAtomPackageView(state.myAtomPackageViewState);
  modalPanel = atom.workspace.addModalPanel({
    item: myAtomPackageView.getElement(),
    visible: false,
  });

  // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
  subscriptions = new CompositeDisposable();

  // Register command that toggles this view
  subscriptions.add(atom.commands.add("atom-workspace", {
    "my-atom-package:toggle": () => toggle(),
  }));
}

export function deactivate(): void {
  modalPanel.destroy();
  subscriptions.dispose();
  myAtomPackageView.destroy();
}

export function serialize(): ISerializedState {
  return {
    myAtomPackageViewState: myAtomPackageView.serialize(),
  };
}

function toggle(): void {
  // tslint:disable-next-line no-console
  console.log("MyAtomPackage was toggled!");
  return (
    modalPanel.isVisible() ?
    modalPanel.hide() :
    modalPanel.show()
  );
}
