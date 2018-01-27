// If your view has data that should persist across sessions, you can put it here:
// tslint:disable-next-line no-empty-interface
interface ISerializedState {

}

export default class MyAtomPackageView {

  public element: HTMLDivElement;

  constructor(serializedState: ISerializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('my-atom-package');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The MyAtomPackage package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  public serialize(): ISerializedState {
    return null;
  }

  // Tear down any state and detach
  public destroy() {
    this.element.remove();
  }

  public getElement() {
    return this.element;
  }

}
