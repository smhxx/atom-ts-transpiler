import { CompositeDisposable } from 'atom';

interface ThisIsATypeScriptFeature {
  isThisValidJavaScript?: boolean;
}

interface WidgetWithFoo {
  hasFoo: true;
  foo: string;
}

interface WidgetWithoutFoo {
  hasFoo: false;
  bar: string;
}

type ThingsThatAreNotJavaScript = ThisIsATypeScriptFeature | never;

type Widget = WidgetWithFoo | WidgetWithoutFoo;

export default {
  activate() {
    // Make sure that this FAILS if it's being passed without transpilation
    const useTypeScriptFeature = {} as ThisIsATypeScriptFeature;
    useTypeScriptFeature.isThisValidJavaScript = false;

    // Make sure that Atom's type declarations are being imported properly
    const cd = new CompositeDisposable();
    cd.add(atom.commands.add('atom-workspace', 'return-foo', () => 'foo'));
  },

  understandsTaggedUnions(widget: Widget): string {
    // Make sure that this isn't Atom's packaged version of TypeScript (~1.4)
    // This will throw an error if compiled by TypeScript 1.x, since older versions didn't
    // understand this kind of process-of-elimination type-guarding based on properties
    let blep: string;
    if (widget.hasFoo) {
      blep = widget.foo;
    } else {
      blep = widget.bar;
    }
    return blep;
  },

  activateDoomsdayMachine(): ThingsThatAreNotJavaScript {
    // Double-check just to make sure. "Never" wasn't introduced until 2.x, so if this gets
    // type-checked successfully, we're definitely not using Atom's built-in TypeScript.
    throw new Error('The whole point of the doomsday machine is lost... IF YOU KEEP IT A SECRET!\
      Why didn\'t you tell the world, eh?');
  },
};
