/**
 * @param {string} code
 * @returns {import("@codesandbox/sandpack-react").SandpackFile}
 */
export default function sandpackFile(code) {
  return {
    code: code,
    hidden: false,
    active: false,
    readOnly: true,
  };
}
