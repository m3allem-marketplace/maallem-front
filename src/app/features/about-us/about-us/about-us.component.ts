import { Component } from '@angular/core';

// واجهة تعريفية لهيكل بيانات عضو الفريق
interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  initials: string;
  color: string;
}

// واجهة تعريفية لهيكل بيانات الإحصائيات
interface StatItem {
  value: string;
  label: string;
  icon: string;
}

// واجهة تعريفية لهيكل بيانات قيم المنصة
interface ValueItem {
  icon: string;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {

  // مصفوفة الإحصائيات المعروضة في الصفحة
  stats: StatItem[] = [
    { value: '+١٠٠٠', label: 'حرفي محترف مسجل', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
    { value: '+٥٠٠٠', label: 'طلب خدمة مكتمل', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
    { value: '٢٧', label: 'محافظة نخدمها', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0' },
    { value: '٩٨٪', label: 'رضا العملاء', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' }
  ];

  // مصفوفة القيم الأساسية للمنصة ومميزاتها التنافسية
  values: ValueItem[] = [
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: 'الموثوقية',
      description: 'كل حرفي على المنصة يمر بعملية تحقق صارمة لضمان أعلى مستوى من الجودة والاحترافية.',
      gradientFrom: '#1B2B6E',
      gradientTo: '#2b41af'
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: 'السرعة والكفاءة',
      description: 'احصل على عروض أسعار من أفضل الحرفيين في دقائق معدودة، ووفّر وقتك وجهدك.',
      gradientFrom: '#FFB400',
      gradientTo: '#e6a200'
    },
    {
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
      title: 'الشفافية',
      description: 'أسعار واضحة بدون مفاجآت، مع نظام تقييم حقيقي يساعدك على اتخاذ القرار الصحيح.',
      gradientFrom: '#28a745',
      gradientTo: '#1e7e34'
    },
    {
      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-5 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
      title: 'الدعم المستمر',
      description: 'فريق دعم متاح على مدار الساعة لمساعدتك في أي وقت تحتاج فيه إلى المساعدة.',
      gradientFrom: '#17a2b8',
      gradientTo: '#117a8b'
    }
  ];

  // مصفوفة أعضاء الفريق الإداري والتنفيذي للمنصة
  team: TeamMember[] = [
    { name: 'يوسف شلبي', role: 'المدير التنفيذي', avatar: '', initials: 'أم', color: '#1B2B6E' },
    { name:'يوسف حمدي', role: 'مدير التقنية', avatar: '', initials: 'سع', color: '#FFB400' },
    { name: 'مهند الموجي', role: 'مدير العمليات', avatar: '', initials: 'مح', color: '#28a745' },
    { name: 'عمر يوسف', role: 'مدير تجربة المستخدم', avatar: '', initials: 'نر', color: '#17a2b8' },
    { name: 'عبد الرحمن علي', role: 'مدير التسويق', avatar: '', initials: 'فع', color: '#9b59b6' },
    { name: 'الباشا', role: 'مدير المجتمع', avatar: '', initials: 'عخ', color: '#e67e22' }
  ];

  // مصفوفة المحطات التاريخية والتوسعية الرئيسية للمنصة عبر السنين
  milestones = [
    { year: '٢٠٢١', title: 'التأسيس', desc: 'انطلقت فكرة مَعْلَم من رغبة حقيقية في ربط الحرفيين المهرة بالعملاء بطريقة سهلة وموثوقة.' },
    { year: '٢٠٢٢', title: 'الإطلاق الرسمي', desc: 'أطلقنا المنصة رسمياً في القاهرة الكبرى مع أكثر من ٢٠٠ حرفي مسجل.' },
    { year: '٢٠٢٣', title: 'التوسع الوطني', desc: 'وصلنا إلى ١٥ محافظة وتجاوزنا حاجز ٢٠٠٠ حرفي على المنصة.' },
    { year: '٢٠٢٤', title: 'الانتشار الكامل', desc: 'نغطي الآن جميع محافظات مصر البالغة ٢٧ محافظة مع أكثر من ١٠٠٠ حرفي محترف.' }
  ];
}