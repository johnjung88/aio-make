import { checklistVersion, projectChecklist } from "@/lib/project-checklist";
export function GET() {
  return new Response(
    [
      "AIO MAKE 의뢰 준비표",
      "버전: " + checklistVersion,
      "",
      ...projectChecklist.flatMap(([title, body]) => [
        title,
        body,
        "작성: ______________________________",
        "",
      ]),
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="aio-project-checklist.txt"',
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
