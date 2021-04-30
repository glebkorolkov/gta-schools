#!/bin/bash
sed -i "s/__SHORT_NAME__/$REACT_APP_MANIFEST_SHORT_NAME/" ./build/manifest.json
sed -i "s/__NAME__/$REACT_APP_MANIFEST_NAME/" ./build/manifest.json