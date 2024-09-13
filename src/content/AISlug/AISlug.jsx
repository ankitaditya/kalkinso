/**
 * Copyright IBM Corp. 2016, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    unstable__Slug as Slug,
    unstable__SlugContent as SlugContent,
    unstable__SlugActions as SlugActions,
    TextArea,
    IconButton
} from '@carbon/react';
import { AiGenerate, ChatBot } from '@carbon/react/icons';
import BlockNoteEditor from '../Dashboard/BlockNoteEditor';

const AISlug = (context) => {
    return <Slug className="slug-container" size="xs">
    <SlugContent>
      <h4>Kalki AI {context}</h4>
      <hr />
      <BlockNoteEditor />
      <SlugActions>
        <IconButton kind="ghost" label="Generate Random">
            <AiGenerate />
        </IconButton>
        <IconButton kind="ghost" label="Chat">
            <ChatBot />
        </IconButton>
      </SlugActions>
    </SlugContent>
  </Slug>
}

export default AISlug;