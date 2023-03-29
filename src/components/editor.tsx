import { EditorProps as DefaultEditorProps, loader } from "@monaco-editor/react";
import dynamic from "next/dynamic";
import { memo, useEffect, useState } from "react";
import tColors from "tailwindcss/colors";
import { useTernaryDarkMode } from 'usehooks-ts';

const MonacoEditor = dynamic(import("@monaco-editor/react"), { ssr: false });

function useNavigator() {
  const [navi, setNavi] = useState<Navigator | null>(null!);
  useEffect(() => {
    setNavi(navigator);
  }, []);
  return navi;
}

interface EditorProps extends DefaultEditorProps {}
function _Editor({ options, theme, beforeMount, ...props }: EditorProps) {
  const navi = useNavigator();
  useEffect(()=>{
    if (navi) {
      loader.config({
        "vs/nls": {
          availableLanguages: {
            "*": navi.language
          },
        }
      })
    }
  }, [navi])


  const { isDarkMode } = useTernaryDarkMode();
  return <MonacoEditor
    theme={theme ? theme : isDarkMode ? "original-dark" : "original-light"}
    // theme={theme ? theme : isDarkMode ? "vs-dark" : "light"}
    beforeMount={monaco => {
      const colors = [
        // light color
        tColors.gray[100],
        // dark color
        tColors.gray[900],
      ]
      monaco.editor.defineTheme('original-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [{
          token: colors[0],
          foreground: colors[0],
          background: colors[1],
          fontStyle: 'bold',
        }],
        colors: {
          "editor.foreground": colors[0],
          "editor.background": colors[1],
        },
      })
      monaco.editor.defineTheme('original-light', {
        base: 'vs',
        inherit: true,
        rules: [{
          token: colors[1],
          foreground: colors[1],
          background: colors[0],
          fontStyle: 'bold',
        }],
        colors: {
          "editor.foreground": colors[1],
          "editor.background": colors[0],
        },
      })
      beforeMount?.(monaco);
    }}
    options={{
      // fontFamily: "CaskaydiaCove Nerd Font, \"游明朝\"",
      // fontSize: 18,
      ...options,
    }}
    language="typescript"
  {...props} />;
}

export const Editor = memo(_Editor);