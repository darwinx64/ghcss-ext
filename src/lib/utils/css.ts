export function minifyCss(css: string): string {
    let output: string = css;
    // Remove comments
    output = output.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove whitespace around selectors, properties, and values
    output = output.replace(/\s*([{}:;])\s*/g, '$1');
    // Remove trailing semicolons inside blocks
    output = output.replace(/;}/g, '}');
    // Remove extra whitespace
    output = output.replace(/\s+/g, ' ');
    // Remove space before the opening brace
    output = output.replace(/\s*{\s*/g, '{');
    // Remove space before the closing brace
    output = output.replace(/\s*}\s*/g, '}');
    // Remove space before the colon
    output = output.replace(/\s*:\s*/g, ':');
    // Remove space before the semicolon
    output = output.replace(/\s*;\s*/g, ';');

    console.log(`Minified CSS`);

    return output.trim();
}
