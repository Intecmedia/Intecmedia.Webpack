/* global VERBOSE */
const $makeNetworkClass = ($type) => ($type ? `network-${$type}` : 'network-unknown');

const $html = document.documentElement;

// eslint-disable-next-line compat/compat -- we are detect vendor prefix
const $conn = (navigator.connection || navigator.mozConnection || navigator.webkitConnection);

if (!$conn) {
    if (VERBOSE) {
        console.log('[network-information] unknown');
    }
    $html.classList.add('network-unknown');
} else {
    // network information test: 'slow-2g', '2g', '3g', or '4g'
    let $effectiveType = $conn.effectiveType;
    $html.classList.toggle('network-detected', !!$effectiveType);
    $html.classList.add($makeNetworkClass($effectiveType));
    if (VERBOSE) {
        console.log(`[network-information] set effectiveType=${$effectiveType}`);
    }

    // network save-data test
    let $saveData = $conn.saveData;
    $html.classList.toggle('save-data', $saveData);
    $html.classList.toggle('no-save-data', !$saveData);
    if (VERBOSE) {
        console.log(`[network-information] set saveData=${JSON.stringify($saveData)}`);
    }

    const $listener = () => {
    // detect network type
        if ($effectiveType !== $conn.effectiveType) {
            if (VERBOSE) {
                console.log('[network-information] change effectiveType:', JSON.stringify({
                    from: $effectiveType,
                    to: $conn.effectiveType,
                }));
            }
            $html.classList.toggle('network-detected', !!$conn.effectiveType);
            $html.classList.remove($makeNetworkClass($effectiveType));
            $html.classList.add($makeNetworkClass($conn.effectiveType));
            $effectiveType = $conn.effectiveType;
        }

        // detect save-data header
        if ($saveData !== $conn.saveData) {
            if (VERBOSE) {
                console.log('[network-information] change saveData:', JSON.stringify({
                    from: $saveData,
                    to: $conn.saveData,
                }));
            }
            $saveData = $conn.saveData;
            $html.classList.toggle('save-data', $conn.saveData);
            $html.classList.toggle('no-save-data', !$conn.saveData);
        }
    };

    if ($conn.addEventListener && ($conn instanceof EventTarget)) {
        try {
            $conn.addEventListener('change', $listener);
        } catch (error) {
            if (VERBOSE) {
                console.log('[network-information] error:', error);
            }
        }
    }
}
