import { redirect } from 'next/navigation'

/** Default channel portal entry (website reference layout). */
export default function GoIndexPage() {
  redirect('/go/website')
}
