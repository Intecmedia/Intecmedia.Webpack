/* global VERBOSE */

const $makeNetworkClass = ($type) => ($type ? ` network-detected network-${$type}` : ' network-unknown');

jQuery(($) => {
    const $html = $(document.documentElement);
    // eslint-disable-next-line compat/compat
    const $conn = (navigator.connection || navigator.mozConnection || navigator.webkitConnection);

    if (!$conn) {
        if (VERBOSE) {
            console.log('[network-information] unknown');
        }
        $html.addClass('network-unknown');
        return;
    }

    // network information test: 'slow-2g', '2g', '3g', or '4g'
    let $effectiveType = $conn.effectiveType;
    $html.addClass($makeNetworkClass($effectiveType));
    if (VERBOSE) {
        console.log(`[network-information] set effectiveType=${$effectiveType}`);
    }

    // network save-data test
    let $saveData = $conn.saveData;
    $html.toggleClass('save-data', $saveData);
    $html.toggleClass('no-save-data', !$saveData);
    if (VERBOSE) {
        console.log(`[network-information] set saveData=${JSON.stringify($saveData)}`);
    }

    if ($conn.addEventListener) {
        $conn.addEventListener('change', () => {
            // detect network type
            if ($effectiveType !== $conn.effectiveType) {
                if (VERBOSE) {
                    console.log('[network-information] change effectiveType:', {
                        from: $effectiveType,
                        to: $conn.effectiveType,
                    });
                }
                $html.removeClass($makeNetworkClass($effectiveType));
                $html.addClass($makeNetworkClass($conn.effectiveType));
                $effectiveType = $conn.effectiveType;
            }

            // detect save-data header
            if ($saveData !== $conn.saveData) {
                if (VERBOSE) {
                    console.log('[network-information] change saveData:', {
                        from: $saveData,
                        to: $conn.saveData,
                    });
                }
                $saveData = $conn.saveData;
                $html.toggleClass('save-data', $conn.saveData);
                $html.toggleClass('no-save-data', !$conn.saveData);
            }
        });
    }
});
