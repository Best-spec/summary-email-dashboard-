import os

class cal_inquiry:
    def __init__(self):
        pass

    def find_inquiry(self):
        folder = self.folder_path.get()
        if not folder or not os.path.isdir(folder):
            messagebox.showerror("Error", "Please select a valid folder")
            return

        summary = defaultdict(lambda: defaultdict(int))
        csv_files = glob.glob(os.path.join(folder, "*.csv"))

        for file in csv_files:
            try:
                df = pd.read_csv(file)
                df.columns = df.columns.str.replace('\ufeff', '').str.strip('"')
                col_name = df.columns[0]
            except Exception as e:
                print(f"Failed to process {file}: {e}")
                continue

            if "-en" in file:
                lang = "English"
            elif "-th" in file:
                lang = "Thai"
            elif "-ru" in file:
                lang = "Russia"
            elif "-de" in file:
                lang = "German"
            elif "-ar" in file:
                lang = "Arabic"
            elif "-zh" in file:
                lang = "Chinese"
            else:
                continue

            for cat in categories.get(lang, []):
                count = df[col_name].astype(str).str.strip().eq(cat).sum()
                summary[lang][cat] += count
        
        summary_dict = {
            lang: {cat: int(count) for cat, count in summary[lang].items()}
            for lang in summary
        }

        # แปลง summary_dict เป็นข้อความอ่านง่าย
        def format_summary_dict(summary_dict):
            lines = []
            for lang, cats in summary_dict.items():
                lines.append(f"Language: {lang}")
                for cat, count in cats.items():
                    lines.append(f"  - {cat}: {count}")
                lines.append("")  # เว้นบรรทัดระหว่างภาษา
            return "\n".join(lines)
        
        readable_text = format_summary_dict(summary_dict)
        self.result_text.delete(1.0, tk.END)

        if summary_dict:
            self.result_text.insert(tk.END, readable_text)
        else:
            self.result_text.insert(tk.END, "No inquiry data found.")

        root = self.root
        show_graph = TotalMonth(folder)
        show_graph.graph_inquiry(summary ,root)