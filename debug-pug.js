
import pug from 'pug'

// Let's build up the template step by step
const testParts = [
  // Part 1
  `.browser-book-view
  NCard.placeholder(v-if='!payload && isLoading')
    template(#header)
      NSkeleton(text, w-48)
    NSkeleton(text, v-for='_ in 20', :width='Math.random() * (80 - 40) + 40 + "%"', mb-2)`,
  // Part 2: add .browser-book-view-main
  `.browser-book-view
  NCard.placeholder(v-if='!payload && isLoading')
    template(#header)
      NSkeleton(text, w-48)
    NSkeleton(text, v-for='_ in 20', :width='Math.random() * (80 - 40) + 40 + "%"', mb-2)
  .browser-book-view-main(v-else)
    NCard(
      :title='bookName',
      :closable='!!(parentKey && items.length)',
      @close='goToParentFolder'
    )
      BrowserEmpty(v-if='!items.length')
      .book-pages-container(:data-page-count='items.length')
        .book-page-item(
          v-for='(item, index) in items',
          :key='item.key',
          :id='"" + item.checksums?.md5',
          :data-page-number='index + 1'
        )`,
  // Part 3: add book-page-image
  `.browser-book-view
  NCard.placeholder(v-if='!payload && isLoading')
    template(#header)
      NSkeleton(text, w-48)
    NSkeleton(text, v-for='_ in 20', :width='Math.random() * (80 - 40) + 40 + "%"', mb-2)
  .browser-book-view-main(v-else)
    NCard(
      :title='bookName',
      :closable='!!(parentKey && items.length)',
      @close='goToParentFolder'
    )
      BrowserEmpty(v-if='!items.length')
      .book-pages-container(:data-page-count='items.length')
        .book-page-item(
          v-for='(item, index) in items',
          :key='item.key',
          :id='"" + item.checksums?.md5',
          :data-page-number='index + 1'
        )
          .book-page-image(v-if='item.previewType === "image"', text-center)
            NImage(
              :src='item.cdnUrl',
              :preview-src='item.cdnUrl',
              :alt='item.key',
              object-fit='contain',
              width='640',
              lazy
            )
              template(#placeholder)
                NSkeleton(h='640px', w='640px', max-w='100%')
              template(#fallback)
                NIcon(size='64'): IconFileUnknown
            </NImage>`,
  // Part4: add book-page-text
  `.browser-book-view
  NCard.placeholder(v-if='!payload && isLoading')
    template(#header)
      NSkeleton(text, w-48)
    NSkeleton(text, v-for='_ in 20', :width='Math.random() * (80 - 40) + 40 + "%"', mb-2)
  .browser-book-view-main(v-else)
    NCard(
      :title='bookName',
      :closable='!!(parentKey && items.length)',
      @close='goToParentFolder'
    )
      BrowserEmpty(v-if='!items.length')
      .book-pages-container(:data-page-count='items.length')
        .book-page-item(
          v-for='(item, index) in items',
          :key='item.key',
          :id='"" + item.checksums?.md5',
          :data-page-number='index + 1'
        )
          .book-page-image(v-if='item.previewType === "image"', text-center)
            NImage(
              :src='item.cdnUrl',
              :preview-src='item.cdnUrl',
              :alt='item.key',
              object-fit='contain',
              width='640',
              lazy
            )
              template(#placeholder)
                NSkeleton(h='640px', w='640px', max-w='100%')
              template(#fallback)
                NIcon(size='64'): IconFileUnknown
            </NImage>
          .book-page-text(
            v-else-if='item.previewType === "text" || item.previewType === "markdown"',
            max-w-860px,
            mx-auto
          )
            NDivider(title-placement='left'): NText(depth='3', text-3) {{ item.key.split('/').slice(-1)[0] }}
            BrowserTextRender(:item, auto-load, min-h-200px)
            NText(depth='3', text-2, select-none) --- EOF ---`,
  // Part5: add second NCard (Navigation)
  `.browser-book-view
  NCard.placeholder(v-if='!payload && isLoading')
    template(#header)
      NSkeleton(text, w-48)
    NSkeleton(text, v-for='_ in 20', :width='Math.random() * (80 - 40) + 40 + "%"', mb-2)
  .browser-book-view-main(v-else)
    NCard(
      :title='bookName',
      :closable='!!(parentKey && items.length)',
      @close='goToParentFolder'
    )
      BrowserEmpty(v-if='!items.length')
      .book-pages-container(:data-page-count='items.length')
        .book-page-item(
          v-for='(item, index) in items',
          :key='item.key',
          :id='"" + item.checksums?.md5',
          :data-page-number='index + 1'
        )
          .book-page-image(v-if='item.previewType === "image"', text-center)
            NImage(
              :src='item.cdnUrl',
              :preview-src='item.cdnUrl',
              :alt='item.key',
              object-fit='contain',
              width='640',
              lazy
            )
              template(#placeholder)
                NSkeleton(h='640px', w='640px', max-w='100%')
              template(#fallback)
                NIcon(size='64'): IconFileUnknown
            </NImage>
          .book-page-text(
            v-else-if='item.previewType === "text" || item.previewType === "markdown"',
            max-w-860px,
            mx-auto
          )
            NDivider(title-placement='left'): NText(depth='3', text-3) {{ item.key.split('/').slice(-1)[0] }}
            BrowserTextRender(:item, auto-load, min-h-200px)
            NText(depth='3', text-2, select-none) --- EOF ---

    NCard(v-if='folders.length > 0', title='Navigation', mt-4)
      .flex.flex-wrap(gap-2)
        NCard.folder-item(
          v-for='(item, index) in folders',
          size='small',
          inline-flex,
          flex-auto,
          w-auto,
          :key='item.key',
          :content-style='{ padding: "0.5rem 1rem" }',
          cursor-pointer,
          @click='navigateToFolder(item)'
        )
          NIcon(:component='FileHelper.getObjectIcon(item)', size='20', mr-2)
          NText {{ item.key.split('/').filter(Boolean).slice(-1)[0] }}`
]

// Now add the full template (with .dev-only section) as part6
testParts.push(`.browser-book-view
  NCard.placeholder(v-if='!payload && isLoading')
    template(#header)
      NSkeleton(text, w-48)
    NSkeleton(text, v-for='_ in 20', :width='Math.random() * (80 - 40) + 40 + "%"', mb-2)
  .browser-book-view-main(v-else)
    NCard(
      :title='bookName',
      :closable='!!(parentKey && items.length)',
      @close='goToParentFolder'
    )
      BrowserEmpty(v-if='!items.length')
      .book-pages-container(:data-page-count='items.length')
        .book-page-item(
          v-for='(item, index) in items',
          :key='item.key',
          :id='"" + item.checksums?.md5',
          :data-page-number='index + 1'
        )
          .book-page-image(v-if='item.previewType === "image"', text-center)
            NImage(
              :src='item.cdnUrl',
              :preview-src='item.cdnUrl',
              :alt='item.key',
              object-fit='contain',
              width='640',
              lazy
            )
              template(#placeholder)
                NSkeleton(h='640px', w='640px', max-w='100%')
              template(#fallback)
                NIcon(size='64'): IconFileUnknown
            </NImage>
          .book-page-text(
            v-else-if='item.previewType === "text" || item.previewType === "markdown"',
            max-w-860px,
            mx-auto
          )
            NDivider(title-placement='left'): NText(depth='3', text-3) {{ item.key.split('/').slice(-1)[0] }}
            BrowserTextRender(:item, auto-load, min-h-200px)
            NText(depth='3', text-2, select-none) --- EOF ---

    NCard(v-if='folders.length > 0', title='Navigation', mt-4)
      .flex.flex-wrap(gap-2)
        NCard.folder-item(
          v-for='(item, index) in folders',
          size='small',
          inline-flex,
          flex-auto,
          w-auto,
          :key='item.key',
          :content-style='{ padding: "0.5rem 1rem" }',
          cursor-pointer,
          @click='navigateToFolder(item)'
        )
          NIcon(:component='FileHelper.getObjectIcon(item)', size='20', mr-2)
          NText {{ item.key.split('/').filter(Boolean).slice(-1)[0] }}

  .dev-only.bg-dev.mt-4
    details
      summary items
      pre {{ items }}
    details.mt-4
      summary subFolders
      pre {{ folders }}`)

testParts.forEach((part, i) => {
  console.log(`\n=== Testing part ${i+1}...`)
  try {
    const tmpl = pug.compile(part, { filename: 'test.pug' })
    console.log('✅ Part', i+1, 'passed')
  } catch (e) {
    console.error('❌ Part', i+1, 'failed')
    console.error('Error:', e.message)
  }
})
